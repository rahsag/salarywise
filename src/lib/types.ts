export type CityTier = 'Metro' | 'Tier-2' | 'Tier-3';

export interface ChatMessage {
  role: 'coach' | 'user';
  text: string;
}

export interface AppState {
  name: string;
  mobile: string;
  email: string;
  otp: [string, string, string, string];

  age: number;
  cityTier: CityTier;
  dependents: number;

  salary: number;
  rent: number;
  emi: number;
  expenses: number;
  sip: number;

  animScore: number;

  emiP: number;
  emiR: number;
  emiN: number;

  sipAmt: number;
  sipR: number;
  sipY: number;

  affIncome: number;
  affDown: number;
  affRate: number;
  affTenure: number;

  taxIncome: number;
  tax80c: number;
  taxHra: number;

  chat: ChatMessage[];
  chatInput: string;
  coachTyping: boolean;

  proUnlocked: boolean;
}

export const initialState: AppState = {
  name: '',
  mobile: '',
  email: '',
  otp: ['', '', '', ''],

  age: 29,
  cityTier: 'Metro',
  dependents: 1,

  salary: 92000,
  rent: 22000,
  emi: 8000,
  expenses: 24000,
  sip: 10000,

  animScore: 0,

  emiP: 2500000,
  emiR: 8.6,
  emiN: 20,

  sipAmt: 15000,
  sipR: 12,
  sipY: 15,

  affIncome: 120000,
  affDown: 1500000,
  affRate: 8.6,
  affTenure: 20,

  taxIncome: 1400000,
  tax80c: 150000,
  taxHra: 180000,

  chat: [
    {
      role: 'coach',
      text: "Hi Rahul 👋 I'm your Money Coach. Ask me about budgeting, tax, home loans or investing — try a suggestion below.",
    },
  ],
  chatInput: '',
  coachTyping: false,

  proUnlocked: false,
};

// Fields that should not be restored verbatim from persisted storage —
// either meaningless after a restart (otp) or would show stale mid-animation
// state if replayed (animScore, coachTyping).
export const NON_PERSISTED_KEYS: (keyof AppState)[] = ['animScore', 'coachTyping', 'otp'];
