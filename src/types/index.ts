// Types for WealthHub application
export interface Asset {
  id: string;
  name: string;
  category: string;
  color: string;
  baseAmount: number;
  archived: boolean;
  targetAllocation?: number;
  riskLevel?: string;
}

export interface HistoryEntry {
  id: string;
  month: string;
  assetId: string;
  nav: number;
  contribution: number;
}

export interface BitcoinTransaction {
  id: string;
  date: string;
  type: 'buy' | 'sell';
  amount: number;
  amountBTC: number;
  totalCost: number;
  meanPrice: number;
}

export interface StockTransaction {
  id: string;
  ticker: string;
  date: string;
  type: 'buy' | 'sell';
  shares: number;
  pricePerShare: number;
  fees: number;
  totalAmount: number;
}

export interface SyncState {
  isSyncing: boolean;
  lastSync: Date | null;
  syncError: string | null;
}

export interface Metrics {
  totalNAV: number;
  totalInv: number;
  totalProfit: number;
  roi: number;
  liquidez: number;
}
