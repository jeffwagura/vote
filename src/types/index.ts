export interface Nominee {
  id: string;
  name: string;
  stageName?: string;
  category: string;
  categoryId: string;
  bio: string;
  notableWork: string;
  votes: number;
  imageUrl: string;
  shareCode: string;
  trend: 'up' | 'stable' | 'hot';
}

export interface Category {
  id: string;
  title: string;
  description: string;
  totalVotes: number;
}

export interface VotePackage {
  id: string;
  votes: number;
  priceKes: number;
  tag?: string;
  bonusPercent?: number;
}

export interface STKTransaction {
  id: string;
  nomineeId: string;
  nomineeName: string;
  category: string;
  votes: number;
  amountKes: number;
  phone: string;
  mpesaReceipt?: string;
  timestamp: string;
  status: 'pending' | 'sent_to_phone' | 'pin_entered' | 'completed' | 'failed';
  errorMessage?: string;
}
