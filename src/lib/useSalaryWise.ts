import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { addExpense as addExpenseRemote, deleteExpense as deleteExpenseRemote, subscribeExpenses, type ExpenseEntry } from './expenses';
import { coachReply, computeScore } from './finance';
import { signOutUser } from './firebaseAuth';
import { cancelScheduledRemoteSave, loadRemoteState, scheduleRemoteSave, subscribeProStatus } from './firestoreSync';
import { purchasePro as purchaseProFlow } from './payments';
import { clearState, loadState, saveState } from './storage';
import { initialState, type AppState, type CityTier } from './types';

export function useSalaryWise() {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const stateRef = useRef(state);
  stateRef.current = state;

  const monthlyExpenseTotal = useMemo(() => {
    const thisMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
    return expenses.filter((e) => e.date.startsWith(thisMonth)).reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);
  const monthlyExpenseTotalRef = useRef(monthlyExpenseTotal);
  monthlyExpenseTotalRef.current = monthlyExpenseTotal;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadState().then((saved) => {
      if (cancelled) return;
      if (saved) setState((cur) => ({ ...cur, ...saved }));
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // @react-native-firebase has no web implementation — it initializes natively
    // from google-services.json/GoogleService-Info.plist at build time, which the
    // web bundle has no equivalent of. Skip auth/Firestore sync entirely on web.
    if (Platform.OS === 'web') return;
    return onAuthStateChanged(getAuth(), (user) => setUid(user?.uid ?? null));
  }, []);

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    loadRemoteState(uid).then((remote) => {
      if (cancelled) return;
      if (remote) {
        setState((cur) => ({ ...cur, ...remote }));
      } else {
        // No doc yet — first-time signup. Seed it with whatever state we have so far.
        scheduleRemoteSave(uid, stateRef.current);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    return subscribeProStatus(uid, (proUnlocked) => {
      setState((cur) => (cur.proUnlocked === proUnlocked ? cur : { ...cur, proUnlocked }));
    });
  }, [uid]);

  useEffect(() => {
    if (!uid) {
      setExpenses([]);
      return;
    }
    return subscribeExpenses(uid, setExpenses);
  }, [uid]);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveState(stateRef.current);
      if (uid) scheduleRemoteSave(uid, stateRef.current);
    }, 400);
    return () => cancelScheduledRemoteSave();
  }, [state, hydrated, uid]);

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    },
    []
  );

  const startScore = useCallback(() => {
    const s = stateRef.current;
    const effectiveExpenses = monthlyExpenseTotalRef.current > 0 ? monthlyExpenseTotalRef.current : s.expenses;
    const target = computeScore(s.salary, s.rent, s.emi, effectiveExpenses, s.sip).total;
    setState((cur) => ({ ...cur, animScore: 0 }));
    if (intervalRef.current) clearInterval(intervalRef.current);
    let n = 0;
    intervalRef.current = setInterval(() => {
      n += Math.max(1, Math.round(target / 28));
      if (n >= target) {
        n = target;
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      setState((cur) => ({ ...cur, animScore: n }));
    }, 32);
  }, []);

  const sendChat = useCallback((text: string) => {
    const t = text.trim();
    if (!t) return;
    setState((cur) => ({
      ...cur,
      chat: [...cur.chat, { role: 'user', text: t }],
      chatInput: '',
      coachTyping: true,
    }));
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      const s = stateRef.current;
      const effectiveExpenses = monthlyExpenseTotalRef.current > 0 ? monthlyExpenseTotalRef.current : s.expenses;
      const reply = coachReply(t, {
        salary: s.salary,
        rent: s.rent,
        emi: s.emi,
        expenses: effectiveExpenses,
        sip: s.sip,
        sipAmt: s.sipAmt,
        sipR: s.sipR,
        sipY: s.sipY,
        taxIncome: s.taxIncome,
        tax80c: s.tax80c,
        taxHra: s.taxHra,
        affIncome: s.affIncome,
        affDown: s.affDown,
        affRate: s.affRate,
        affTenure: s.affTenure,
        scoreTotal: computeScore(s.salary, s.rent, s.emi, effectiveExpenses, s.sip).total,
      });
      setState((cur) => ({
        ...cur,
        chat: [...cur.chat, { role: 'coach', text: reply }],
        coachTyping: false,
      }));
    }, 850);
  }, []);

  const set = <K extends keyof AppState>(key: K) => (value: AppState[K]) =>
    setState((cur) => ({ ...cur, [key]: value }));

  const purchasePro = useCallback(async () => {
    const s = stateRef.current;
    await purchaseProFlow(s.name, s.email);
    // The Cloud Function already wrote proUnlocked to Firestore via the Admin
    // SDK — this just reflects it locally without waiting on the next sync.
    setState((cur) => ({ ...cur, proUnlocked: true }));
  }, []);

  const addExpense = useCallback(
    (entry: Omit<ExpenseEntry, 'id'>) => {
      if (!uid) return Promise.resolve();
      return addExpenseRemote(uid, entry);
    },
    [uid]
  );

  const deleteExpense = useCallback(
    (id: string) => {
      if (!uid) return Promise.resolve();
      return deleteExpenseRemote(uid, id);
    },
    [uid]
  );

  const signOut = useCallback(async () => {
    await signOutUser();
    await clearState();
    setState(initialState);
  }, []);

  const actions = {
    startScore,
    setName: set('name'),
    setEmail: set('email'),
    setPassword: set('password'),
    setAge: set('age'),
    setCityTier: (v: CityTier) => set('cityTier')(v),
    depMinus: () => setState((cur) => ({ ...cur, dependents: Math.max(0, cur.dependents - 1) })),
    depPlus: () => setState((cur) => ({ ...cur, dependents: Math.min(9, cur.dependents + 1) })),
    setSalary: set('salary'),
    setRent: set('rent'),
    setEmi: set('emi'),
    setExpenses: set('expenses'),
    setSip: set('sip'),
    setEmiP: set('emiP'),
    setEmiR: set('emiR'),
    setEmiN: set('emiN'),
    setSipAmt: set('sipAmt'),
    setSipR: set('sipR'),
    setSipY: set('sipY'),
    setAffIncome: set('affIncome'),
    setAffDown: set('affDown'),
    setAffRate: set('affRate'),
    setAffTenure: set('affTenure'),
    setTaxIncome: set('taxIncome'),
    setTax80c: set('tax80c'),
    setTaxHra: set('taxHra'),
    setChatInput: set('chatInput'),
    sendChat,
    purchasePro,
    addExpense,
    deleteExpense,
    signOut,
  };

  return { state, actions, hydrated, expenses, monthlyExpenseTotal };
}

export type SalaryWiseActions = ReturnType<typeof useSalaryWise>['actions'];
