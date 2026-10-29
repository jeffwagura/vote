import React, { useState } from 'react';
import { Nominee, VotePackage } from '../types';
import { VOTE_PACKAGES } from '../data/awardsData';
import { PhoneSTKSimulator } from './PhoneSTKSimulator';

interface VotingModalProps {
  nominee: Nominee | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmVotes: (nomineeId: string, votesCount: number, amountKes: number, receipt: string) => void;
  initialShowPhonePreview?: boolean;
}

export const VotingModal: React.FC<VotingModalProps> = ({
  nominee,
  isOpen,
  onClose,
  onConfirmVotes,
  initialShowPhonePreview = false,
}) => {
  const [selectedPkg, setSelectedPkg] = useState<VotePackage>(VOTE_PACKAGES[1]); // default to 5 votes (KES 50)
  const [customVotes, setCustomVotes] = useState<number | ''>('');
  const [isCustom, setIsCustom] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('0712345678');
  const [phoneError, setPhoneError] = useState('');
  const [stkSent, setStkSent] = useState(initialShowPhonePreview);
  const [viewMode, setViewMode] = useState<'checkout' | 'phone-view'>(
    initialShowPhonePreview ? 'phone-view' : 'checkout'
  );

  if (!isOpen || !nominee) return null;

  // Calculate pricing
  const totalVotesCount = isCustom
    ? Number(customVotes) || 1
    : selectedPkg.votes;

  const totalAmountKes = isCustom
    ? Math.max(10, (Number(customVotes) || 1) * 10)
    : selectedPkg.priceKes;

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\s+/g, '').replace('+', '');
    // Safaricom patterns: 07XX, 01XX, 2547XX, 2541XX
    const regex = /^(?:254|0)(?:7[0-2,4-9]|1[1-2])[0-9]{7}$/;
    if (!regex.test(cleaned)) {
      setPhoneError('Please enter a valid Safaricom number (e.g. 0712 345 678, 0722..., 0110...)');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleTriggerSTK = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(phoneNumber)) return;
    setStkSent(true);
    setViewMode('phone-view');
  };

  const handleSTKSuccess = (receipt: string) => {
    onConfirmVotes(nominee.id, totalVotesCount, totalAmountKes, receipt);
    setTimeout(() => {
      onClose();
      setStkSent(false);
      setViewMode('checkout');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-bold text-sm">Official Voting Portal</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-xs text-neutral-400">{nominee.category}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-neutral-800 rounded-lg p-0.5 border border-neutral-700 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('checkout')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'checkout'
                    ? 'bg-neutral-900 text-amber-400 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Web Form
              </button>
              <button
                type="button"
                onClick={() => setViewMode('phone-view')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'phone-view'
                    ? 'bg-neutral-900 text-emerald-400 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Phone STK Outlook
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {viewMode === 'phone-view' ? (
            /* Direct Phone STK Outlook View */
            <div className="py-2 flex flex-col items-center">
              <PhoneSTKSimulator
                nominee={nominee}
                selectedPackage={{ votes: totalVotesCount, priceKes: totalAmountKes }}
                phoneNumber={phoneNumber}
                onSuccess={handleSTKSuccess}
                onCancel={() => {
                  setStkSent(false);
                  setViewMode('checkout');
                }}
              />
              <div className="mt-4 text-center">
                <button
                  onClick={() => setViewMode('checkout')}
                  className="text-xs text-neutral-400 hover:text-amber-400 underline underline-offset-4 cursor-pointer"
                >
                  ← Back to Vote &amp; Package Settings
                </button>
              </div>
            </div>
          ) : (
            /* Checkout & Configuration Form */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column: Nominee Spotlight & Summary */}
              <div className="md:col-span-5 space-y-4">
                <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950">
                  <div className="relative aspect-4/3 w-full bg-neutral-800">
                    <img
                      src={nominee.imageUrl}
                      alt={nominee.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">Nominee</span>
                      <h4 className="text-lg font-bold text-white">{nominee.name}</h4>
                    </div>
                  </div>
                  <div className="p-4 space-y-2 text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>Category</span>
                      <span className="text-white font-medium">{nominee.category}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Current Tally</span>
                      <span className="text-amber-400 font-mono font-bold tabular-nums">
                        {nominee.votes.toLocaleString()} votes
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>M-Pesa Reference Code</span>
                      <span className="text-emerald-400 font-mono">{nominee.shareCode}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-neutral-950/70 border border-neutral-800 rounded-xl text-xs space-y-1.5 text-neutral-400">
                  <p className="font-semibold text-neutral-200">How payment is completed:</p>
                  <p>1. Enter your Safaricom line below and press &quot;Request STK Push&quot;.</p>
                  <p>2. A flash prompt appears on your phone screen asking for your PIN.</p>
                  <p>3. Once entered, M-Pesa verifies and adds your votes immediately.</p>
                </div>
              </div>

              {/* Right Column: Vote Packages & Phone Form */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-neutral-200 uppercase tracking-wider mb-2">
                    1. Choose Voting Package
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {VOTE_PACKAGES.map((pkg) => {
                      const isSelected = !isCustom && selectedPkg.id === pkg.id;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => {
                            setSelectedPkg(pkg);
                            setIsCustom(false);
                          }}
                          className={`p-3 text-left rounded-xl border transition-all cursor-pointer relative ${
                            isSelected
                              ? 'bg-amber-400/10 border-amber-400 text-white'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          {pkg.bonusPercent && (
                            <span className="absolute -top-2 right-2 px-1.5 py-0.5 bg-emerald-500 text-neutral-950 font-bold text-[9px] rounded uppercase">
                              +{pkg.bonusPercent}% Bonus
                            </span>
                          )}
                          <p className="text-base font-bold text-white font-mono tabular-nums">
                            {pkg.votes} <span className="text-xs font-sans font-normal text-neutral-400">Votes</span>
                          </p>
                          <p className="text-xs font-mono font-semibold text-amber-400 mt-1">
                            KES {pkg.priceKes}
                          </p>
                          <p className="text-[10px] text-neutral-500 mt-0.5">{pkg.tag}</p>
                        </button>
                      );
                    })}

                    {/* Custom Votes Option */}
                    <button
                      type="button"
                      onClick={() => setIsCustom(true)}
                      className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                        isCustom
                          ? 'bg-amber-400/10 border-amber-400 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <p className="text-sm font-bold text-white">Custom</p>
                      <p className="text-xs font-mono text-amber-400 mt-1">KES 10 / vote</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">Flexible</p>
                    </button>
                  </div>

                  {/* Custom Votes Input if Selected */}
                  {isCustom && (
                    <div className="mt-3 p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between gap-4">
                      <span className="text-xs text-neutral-300">Enter desired votes:</span>
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={customVotes}
                        onChange={(e) => setCustomVotes(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10)))}
                        placeholder="e.g. 75"
                        className="w-28 px-3 py-1.5 text-sm bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono text-right focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Safaricom Phone Number Form */}
                <form onSubmit={handleTriggerSTK} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-neutral-200 uppercase tracking-wider">
                        2. Safaricom M-Pesa Phone Number
                      </label>
                      <span className="text-[11px] text-emerald-400 font-mono">STK Ready</span>
                    </div>

                    <div className="relative">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          if (phoneError) validatePhone(e.target.value);
                        }}
                        placeholder="07XX XXX XXX or 254..."
                        className={`w-full px-4 py-3 bg-neutral-950 border rounded-xl text-white font-mono text-base tracking-wider focus:outline-none transition-colors ${
                          phoneError
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-neutral-800 focus:border-amber-400'
                        }`}
                      />
                      <span className="absolute right-3.5 top-3.5 text-xs text-neutral-500 font-mono">
                        KES {totalAmountKes}
                      </span>
                    </div>

                    {phoneError ? (
                      <p className="text-xs text-red-400 mt-1.5">{phoneError}</p>
                    ) : (
                      <p className="text-[11px] text-neutral-500 mt-1.5">
                        Accepts Kenyan format: 0712345678, 0722XXXXXX, 0110XXXXXX, or 2547XXXXXXXX.
                      </p>
                    )}
                  </div>

                  {/* Summary Checkout Box */}
                  <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-neutral-400">Order Total:</p>
                      <p className="text-lg font-bold text-white font-mono tabular-nums">
                        KES {totalAmountKes}.00
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-neutral-400">Credited Votes:</p>
                      <p className="text-lg font-bold text-amber-400 font-mono tabular-nums">
                        +{totalVotesCount} Votes
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3.5 px-6 text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer shadow-lg shadow-amber-400/10 text-center"
                    >
                      Request M-Pesa STK Push (KES {totalAmountKes})
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('phone-view')}
                      className="py-3.5 px-4 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Preview Phone Screen Look
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
