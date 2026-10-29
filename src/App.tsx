import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryNav } from './components/CategoryNav';
import { NomineeCard } from './components/NomineeCard';
import { VotingModal } from './components/VotingModal';
import { Leaderboard } from './components/Leaderboard';
import { HowItWorks } from './components/HowItWorks';
import { DarajaGuideModal } from './components/DarajaGuideModal';
import { Footer } from './components/Footer';
import { INITIAL_NOMINEES } from './data/awardsData';
import { Nominee, STKTransaction } from './types';

export default function App() {
  const [nominees, setNominees] = useState<Nominee[]>(INITIAL_NOMINEES);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [activeView, setActiveView] = useState<'nominees' | 'leaderboard' | 'how-it-works' | 'developer-guide'>('nominees');
  const [selectedNominee, setSelectedNominee] = useState<Nominee | null>(null);
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
  const [initialPhoneView, setInitialPhoneView] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentTransactions, setRecentTransactions] = useState<STKTransaction[]>([
    {
      id: 'tx-1',
      nomineeId: 'kwame-mensah',
      nomineeName: 'Kwame Mensah',
      category: 'Male Artist of the Year',
      votes: 5,
      amountKes: 50,
      phone: '0712***678',
      mpesaReceipt: 'QK912LK98A',
      timestamp: '2 mins ago',
      status: 'completed',
    },
    {
      id: 'tx-2',
      nomineeId: 'zola-achieng',
      nomineeName: 'Zola Achieng',
      category: 'Best Lead Actress',
      votes: 20,
      amountKes: 180,
      phone: '0722***410',
      mpesaReceipt: 'QK884XP19C',
      timestamp: '5 mins ago',
      status: 'completed',
    },
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalVotes = nominees.reduce((acc, curr) => acc + curr.votes, 0);

  const filteredNominees = nominees.filter((n) => {
    const matchesCategory = activeCategoryId === 'all' || n.categoryId === activeCategoryId;
    const matchesSearch =
      n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.shareCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenVoteModal = (nominee: Nominee, showPhoneDirectly = false) => {
    setSelectedNominee(nominee);
    setInitialPhoneView(showPhoneDirectly);
    setIsVotingModalOpen(true);
  };

  const handleConfirmVotes = (
    nomineeId: string,
    votesCount: number,
    amountKes: number,
    receipt: string
  ) => {
    const targetNominee = nominees.find((n) => n.id === nomineeId);
    if (!targetNominee) return;

    // Increment votes
    setNominees((prev) =>
      prev.map((nom) =>
        nom.id === nomineeId ? { ...nom, votes: nom.votes + votesCount } : nom
      )
    );

    // Record verified transaction
    const newTx: STKTransaction = {
      id: `tx-${Date.now()}`,
      nomineeId,
      nomineeName: targetNominee.name,
      category: targetNominee.category,
      votes: votesCount,
      amountKes,
      phone: '07XX***XXX',
      mpesaReceipt: receipt,
      timestamp: 'Just now',
      status: 'completed',
    };
    setRecentTransactions((prev) => [newTx, ...prev.slice(0, 4)]);

    // Show toast
    setToastMessage(`Confirmed: +${votesCount} votes added for ${targetNominee.name}! M-Pesa Ref: ${receipt}`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-neutral-950 font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 text-xs">
          <span>✓</span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 hover:opacity-75 cursor-pointer text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Bar Contract Navigation */}
      <Header
        activeView={activeView}
        onNavigate={(view) => {
          if (view === 'developer-guide') {
            setIsGuideOpen(true);
          } else {
            setActiveView(view);
          }
        }}
        onOpenQuickVote={() => handleOpenVoteModal(nominees[0])}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          totalVotes={totalVotes}
          onExploreNominees={() => {
            setActiveView('nominees');
            const el = document.getElementById('nominees-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onViewIntegration={() => setActiveView('how-it-works')}
        />

        {/* View Switching */}
        {activeView === 'nominees' && (
          <>
            {/* Category Filter Nav */}
            <CategoryNav
              selectedCategoryId={activeCategoryId}
              onSelectCategory={setActiveCategoryId}
            />

            {/* Nominees Grid Section */}
            <section id="nominees-section" className="py-12 px-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Official Nominees
                  </h2>
                  <p className="text-sm text-neutral-400 mt-1">
                    Select a nominee to inspect packages or preview the phone STK payment screen.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search star or code..."
                    className="w-full px-3.5 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-xs text-neutral-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Grid of Nominee Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNominees.map((nominee, idx) => {
                  const categoryTotal = nominees
                    .filter((n) => n.categoryId === nominee.categoryId)
                    .reduce((sum, n) => sum + n.votes, 0);

                  return (
                    <NomineeCard
                      key={nominee.id}
                      nominee={nominee}
                      rank={idx + 1}
                      totalCategoryVotes={categoryTotal}
                      onVote={(nom) => handleOpenVoteModal(nom, false)}
                      onPreviewSTK={(nom) => handleOpenVoteModal(nom, true)}
                    />
                  );
                })}
              </div>

              {filteredNominees.length === 0 && (
                <div className="p-12 text-center bg-neutral-900 rounded-2xl border border-neutral-800">
                  <p className="text-neutral-400 text-sm">No nominees found matching &quot;{searchQuery}&quot;.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategoryId('all');
                    }}
                    className="mt-3 px-4 py-2 text-xs font-semibold text-amber-400 hover:underline cursor-pointer"
                  >
                    Reset Filter
                  </button>
                </div>
              )}

              {/* Recent Live Verified Votes Bar */}
              <div className="mt-14 p-5 bg-neutral-900/80 border border-neutral-800 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
                    Live Verified M-Pesa Vote Feed
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono">Safaricom Daraja Webhook</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-emerald-400 font-mono text-[11px] font-bold">
                          {tx.mpesaReceipt}
                        </span>
                        <span className="text-neutral-400 font-medium">
                          +{tx.votes} votes for <span className="text-white font-semibold">{tx.nomineeName}</span>
                        </span>
                      </div>
                      <span className="text-neutral-500 font-mono text-[11px]">{tx.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {activeView === 'leaderboard' && (
          <>
            <CategoryNav
              selectedCategoryId={activeCategoryId}
              onSelectCategory={setActiveCategoryId}
            />
            <Leaderboard
              nominees={nominees}
              activeCategoryId={activeCategoryId}
              onVote={(nom) => handleOpenVoteModal(nom, false)}
              onPreviewSTK={(nom) => handleOpenVoteModal(nom, true)}
            />
          </>
        )}

        {activeView === 'how-it-works' && (
          <HowItWorks
            onTryDemo={() => handleOpenVoteModal(nominees[0], true)}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(view) => {
          if (view === 'developer-guide') {
            setIsGuideOpen(true);
          } else {
            setActiveView(view);
          }
        }}
      />

      {/* Voting & STK Push Modal */}
      <VotingModal
        nominee={selectedNominee}
        isOpen={isVotingModalOpen}
        onClose={() => setIsVotingModalOpen(false)}
        onConfirmVotes={handleConfirmVotes}
        initialShowPhonePreview={initialPhoneView}
      />

      {/* Daraja M-Pesa STK Push Developer Guide & Code Modal */}
      <DarajaGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onOpenPhonePreview={() => {
          setIsGuideOpen(false);
          handleOpenVoteModal(nominees[0], true);
        }}
      />
    </div>
  );
}
