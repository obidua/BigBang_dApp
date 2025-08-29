export interface User {
  address: string;
  userId: number;
  isRegistered: boolean;
  registrationTime: number;
  sponsor: string;
  totalEarningsUSD: number;
  totalEarningsRAMA: number;
  repurchaseCount: number;
  currentOrbitX: number;
  orbitCount: number;
}

export interface OrbitIncomeRecord {
  coin: string;
  amount: string;
  usd: string;
  timestamp: number;
  donorId: string;
  level: number;
}

export interface EarningPart {
  usdValue: string;
  ramaAmount: string;
  from: string;
  donorId: string;
  level: number;
}

export interface OrbitXSlot {
  totalUSD: string;
  parts: EarningPart[];
}

export interface Orbit {
  orbitId: number;
  completedX: number;
  xSlots: OrbitXSlot[];
}

export interface TeamMember {
  wallet: string;
  incomeEarned: string;
  incomeEarnedRAMA: string;
  registrationTime: number;
  sponsor: string;
}

export interface LevelIncome {
  level: number;
  amount: string;
  ramaAmount: string;
  percentage: number;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string;
  isConnecting: boolean;
}

export interface ContractState {
  totalUsers: number;
  totalRepurchases: number;
  totalVolumeUSD: string;
  joinAmountRAMA: string;
  joinAmountUSD: string;
}