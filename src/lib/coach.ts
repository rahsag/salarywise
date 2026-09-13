import { getApp } from '@react-native-firebase/app';
import { getFunctions, httpsCallable } from '@react-native-firebase/functions';
import type { ChatMessage } from './types';

// Must match setGlobalOptions({ region: ... }) in functions/src/index.ts.
const FUNCTIONS_REGION = 'asia-south1';

// Only the recent turns are needed for conversational context.
const MAX_HISTORY_TURNS = 10;

export interface CoachAskContext {
  salary: number;
  rent: number;
  emi: number;
  expenses: number;
  sip: number;
  sipAmt: number;
  sipR: number;
  sipY: number;
  taxIncome: number;
  tax80c: number;
  taxHra: number;
  affIncome: number;
  affDown: number;
  affRate: number;
  affTenure: number;
  scoreTotal: number;
}

interface AskCoachResult {
  reply: string;
}

function friendlyCoachError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  if (/permission-denied/.test(code)) return 'Money Coach is a Pro feature — unlock it to chat.';
  const message = (err as { message?: string })?.message;
  return message || "Couldn't reach your Money Coach. Please try again.";
}

export async function askCoach(
  message: string,
  context: CoachAskContext,
  history: ChatMessage[]
): Promise<string> {
  const functions = getFunctions(getApp(), FUNCTIONS_REGION);
  try {
    const ask = httpsCallable<
      { message: string; context: CoachAskContext; history: ChatMessage[] },
      AskCoachResult
    >(functions, 'askMoneyCoach');
    const { data } = await ask({ message, context, history: history.slice(-MAX_HISTORY_TURNS) });
    return data.reply;
  } catch (err) {
    throw new Error(friendlyCoachError(err));
  }
}
