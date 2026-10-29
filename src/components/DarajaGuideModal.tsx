import React, { useState } from 'react';

interface DarajaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPhonePreview: () => void;
}

export const DarajaGuideModal: React.FC<DarajaGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenPhonePreview,
}) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'backend' | 'frontend' | 'callback'>('flow');
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const backendCode = `// server/routes/mpesa.ts (Express + Node.js)
import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

// Safaricom Daraja Credentials (Sandbox or Production)
const DARAJA_CONSUMER_KEY = process.env.DARAJA_CONSUMER_KEY || 'YOUR_CONSUMER_KEY';
const DARAJA_CONSUMER_SECRET = process.env.DARAJA_CONSUMER_SECRET || 'YOUR_CONSUMER_SECRET';
const DARAJA_PASSKEY = process.env.DARAJA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const DARAJA_SHORTCODE = process.env.DARAJA_SHORTCODE || '174379'; // Paybill or Till
const DARAJA_CALLBACK_URL = process.env.DARAJA_CALLBACK_URL || 'https://your-domain.com/api/mpesa/callback';

// 1. Generate OAuth 2.0 Access Token from Safaricom
async function getDarajaAccessToken(): Promise<string> {
  const auth = Buffer.from(\`\${DARAJA_CONSUMER_KEY}:\${DARAJA_CONSUMER_SECRET}\`).toString('base64');
  const response = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      headers: {
        Authorization: \`Basic \${auth}\`,
      },
    }
  );
  return response.data.access_token;
}

// 2. Trigger Lipa na M-Pesa Online (STK Push)
router.post('/stkpush', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, amount, nomineeId, nomineeCode } = req.body;

    // Normalize phone number to 254XXXXXXXXX
    let formattedPhone = phoneNumber.replace(/\\s+/g, '').replace('+', '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    }

    // Format Timestamp: YYYYMMDDHHmmss
    const date = new Date();
    const timestamp =
      date.getFullYear() +
      String(date.getMonth() + 1).padStart(2, '0') +
      String(date.getDate()).padStart(2, '0') +
      String(date.getHours()).padStart(2, '0') +
      String(date.getMinutes()).padStart(2, '0') +
      String(date.getSeconds()).padStart(2, '0');

    // Generate Base64 Password: BusinessShortCode + Passkey + Timestamp
    const password = Buffer.from(
      \`\${DARAJA_SHORTCODE}\${DARAJA_PASSKEY}\${timestamp}\`
    ).toString('base64');

    const token = await getDarajaAccessToken();

    // Call Daraja STK Push Endpoint
    const stkPayload = {
      BusinessShortCode: DARAJA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(Number(amount)),
      PartyA: formattedPhone, // Customer paying
      PartyB: DARAJA_SHORTCODE, // Paybill receiving
      PhoneNumber: formattedPhone,
      CallBackURL: DARAJA_CALLBACK_URL,
      AccountReference: nomineeCode || 'STARVOTE',
      TransactionDesc: \`Votes for \${nomineeId}\`,
    };

    const darajaRes = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      stkPayload,
      {
        headers: {
          Authorization: \`Bearer \${token}\`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Daraja returns: { MerchantRequestID, CheckoutRequestID, ResponseCode: "0", ResponseDescription, CustomerMessage }
    return res.status(200).json({
      success: true,
      message: 'STK Push sent to customer handset',
      checkoutRequestId: darajaRes.data.CheckoutRequestID,
      merchantRequestId: darajaRes.data.MerchantRequestID,
    });
  } catch (error: any) {
    console.error('STK Push Error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.response?.data?.errorMessage || 'Failed to trigger STK prompt',
    });
  }
});

export default router;`;

  const callbackCode = `// server/routes/mpesaCallback.ts
import express, { Request, Response } from 'express';

const router = express.Router();

// Safaricom Webhook Callback: Fired when user enters PIN or cancels
router.post('/callback', async (req: Request, res: Response) => {
  try {
    const callbackData = req.body?.Body?.stkCallback;
    if (!callbackData) {
      return res.status(400).send('Invalid callback structure');
    }

    const { ResultCode, ResultDesc, MerchantRequestID, CheckoutRequestID, CallbackMetadata } = callbackData;

    // ResultCode === 0 means user entered correct PIN and payment succeeded
    if (ResultCode === 0) {
      const items = CallbackMetadata?.Item || [];
      const amount = items.find((i: any) => i.Name === 'Amount')?.Value;
      const mpesaReceipt = items.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
      const phone = items.find((i: any) => i.Name === 'PhoneNumber')?.Value;
      const transDate = items.find((i: any) => i.Name === 'TransactionDate')?.Value;

      console.log(\`[M-PESA SUCCESS] \${mpesaReceipt} paid KES \${amount} from \${phone}\`);

      // 1. Calculate votes based on voting rules (e.g. 10 KES = 1 vote)
      const votesEarned = Math.floor(Number(amount) / 10);

      // 2. Increment candidate votes in your database
      // await db.nominees.update({ where: { shareCode: ... }, data: { votes: { increment: votesEarned } } });

      // 3. Notify frontend via WebSocket or polling
    } else {
      // User cancelled prompt (ResultCode 1032) or wrong PIN (ResultCode 1) or timeout
      console.warn(\`[M-PESA CANCELLED/FAILED] Code: \${ResultCode} - \${ResultDesc}\`);
    }

    // Always acknowledge Safaricom with 200 OK
    return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (err) {
    console.error('Callback error:', err);
    return res.status(500).json({ ResultCode: 1, ResultDesc: 'Error' });
  }
});

export default router;`;

  const frontendCode = `// src/services/mpesaApi.ts
export async function sendSTKPush(payload: {
  phoneNumber: string;
  amount: number;
  nomineeId: string;
  nomineeCode: string;
}) {
  const response = await fetch('/api/mpesa/stkpush', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to trigger STK prompt');
  }

  return data;
}

// Poll or listen for transaction confirmation
export async function checkPaymentStatus(checkoutRequestId: string) {
  const response = await fetch(\`/api/mpesa/query?checkoutRequestId=\${checkoutRequestId}\`);
  return response.json();
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/90">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold text-sm">Safaricom Daraja STK Push</span>
              <span className="text-neutral-600">·</span>
              <span className="text-xs text-neutral-400">Complete Developer Integration Guide</span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              How the phone number triggers the flash PIN dialog on the voter&apos;s handset
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenPhonePreview}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
            >
              See Voter Phone View
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center border-b border-neutral-800 bg-neutral-950 px-6 gap-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('flow')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'flow'
                ? 'border-emerald-400 text-emerald-400 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            01. Architecture &amp; Workflow
          </button>
          <button
            onClick={() => setActiveTab('backend')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'backend'
                ? 'border-emerald-400 text-emerald-400 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            02. Node.js STK Route
          </button>
          <button
            onClick={() => setActiveTab('callback')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'callback'
                ? 'border-emerald-400 text-emerald-400 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            03. Webhook Callback
          </button>
          <button
            onClick={() => setActiveTab('frontend')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'frontend'
                ? 'border-emerald-400 text-emerald-400 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            04. React Frontend Call
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {activeTab === 'flow' && (
            <div className="space-y-6">
              {/* Step-by-step visual roadmap */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold">Phase A</span>
                  <h4 className="text-sm font-bold text-white">Safaricom Daraja Setup</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    1. Create account on <a href="https://developer.safaricom.co.ke" target="_blank" rel="noreferrer" className="text-amber-400 underline">developer.safaricom.co.ke</a>.<br />
                    2. Create an App under Lipa Na M-Pesa sandbox.<br />
                    3. Obtain your <span className="text-neutral-200">Consumer Key</span>, <span className="text-neutral-200">Consumer Secret</span>, and <span className="text-neutral-200">Passkey</span>.
                  </p>
                </div>

                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold">Phase B</span>
                  <h4 className="text-sm font-bold text-white">The STK Push Trigger</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    When voter inputs phone (e.g. 0712345678) and amount, your backend sends an encrypted HTTPS POST to Safaricom LNMO endpoint.<br />
                    Safaricom wakes up the SIM Tool Kit on the voter&apos;s phone in under 2 seconds.
                  </p>
                </div>

                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold">Phase C</span>
                  <h4 className="text-sm font-bold text-white">PIN &amp; Instant Webhook</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Voter types their secret 4-digit PIN.<br />
                    Safaricom transfers KES to your Paybill/Till, sends M-Pesa SMS to voter, and fires a POST callback to your <code className="text-amber-300">/api/mpesa/callback</code> webhook to add the votes!
                  </p>
                </div>
              </div>

              {/* Data Flow Diagram Card */}
              <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Visual Request &amp; Handshake Lifecycle</span>
                  <span className="text-xs text-emerald-400 font-mono">End-to-End SSL</span>
                </h4>
                <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 font-mono text-xs text-neutral-300 space-y-2 leading-relaxed">
                  <p className="text-amber-400">[VOTER IN BROWSER] &rarr; Enters phone 0722000000 + selects 50 KES (5 votes)</p>
                  <p className="text-neutral-400">&nbsp;&nbsp;&darr; POST /api/mpesa/stkpush</p>
                  <p className="text-sky-400">[YOUR NODE.JS BACKEND] &rarr; Signs Base64 password &amp; calls Safaricom Daraja API</p>
                  <p className="text-neutral-400">&nbsp;&nbsp;&darr; Safaricom GSM Core Network push</p>
                  <p className="text-emerald-400">[VOTER&apos;S PHONE SCREEN] &rarr; Pops up modal &quot;Pay KES 50 to STARVOTE? Enter PIN&quot;</p>
                  <p className="text-neutral-400">&nbsp;&nbsp;&darr; User enters PIN [ • • • • ] and clicks OK</p>
                  <p className="text-emerald-300">[SAFARICOM GATEWAY] &rarr; Deducts KES 50 + triggers /api/mpesa/callback</p>
                  <p className="text-white">[STARVOTE DATABASE] &rarr; Receives ResultCode: 0 &rarr; Increments votes +5 live!</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backend' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-400">
                  Ready-to-use Node.js Express route for triggering the Lipa Na M-Pesa Online STK Push:
                </p>
                <button
                  onClick={() => copyToClipboard(backendCode, 'backend')}
                  className="px-3 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-white rounded-md cursor-pointer transition-colors"
                >
                  {copied === 'backend' ? 'Copied ✓' : 'Copy Route Code'}
                </button>
              </div>
              <pre className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[500px]">
                {backendCode}
              </pre>
            </div>
          )}

          {activeTab === 'callback' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-400">
                  The Safaricom Callback Webhook that automatically registers the payment and updates the star&apos;s vote tally:
                </p>
                <button
                  onClick={() => copyToClipboard(callbackCode, 'callback')}
                  className="px-3 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-white rounded-md cursor-pointer transition-colors"
                >
                  {copied === 'callback' ? 'Copied ✓' : 'Copy Webhook Code'}
                </button>
              </div>
              <pre className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[500px]">
                {callbackCode}
              </pre>
            </div>
          )}

          {activeTab === 'frontend' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-400">
                  Client-side React service function to trigger the voting transaction:
                </p>
                <button
                  onClick={() => copyToClipboard(frontendCode, 'frontend')}
                  className="px-3 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-white rounded-md cursor-pointer transition-colors"
                >
                  {copied === 'frontend' ? 'Copied ✓' : 'Copy Client Code'}
                </button>
              </div>
              <pre className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[500px]">
                {frontendCode}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
