import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { toE164 } from './firebaseAuth';
import { coachReply, computeScore } from './finance';
import { cancelScheduledRemoteSave, loadRemoteState, scheduleRemoteSave, subscribeProStatus } from './firestoreSync';
import { purchasePro as purchaseProFlow } from './payments';
import { loadState, saveState } from './storage';
import { initialState, type AppState, type CityTier } from './types';

export function useSalaryWise() {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

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
    const target = computeScore(s.salary, s.rent, s.emi, s.expenses, s.sip).total;
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
      const reply = coachReply(t, {
        salary: s.salary,
        rent: s.rent,
        emi: s.emi,
        expenses: s.expenses,
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
        scoreTotal: computeScore(s.salary, s.rent, s.emi, s.expenses, s.sip).total,
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
    await purchaseProFlow(s.name, s.email, toE164(s.mobile) ?? '');
    // The Cloud Function already wrote proUnlocked to Firestore via the Admin
    // SDK — this just reflects it locally without waiting on the next sync.
    setState((cur) => ({ ...cur, proUnlocked: true }));
  }, []);

  const actions = {
    startScore,
    setName: set('name'),
    setMobile: set('mobile'),
    setEmail: set('email'),
    setOtpDigit: (i: number, v: string) =>
      setState((cur) => {
        const otp = [...cur.otp] as AppState['otp'];
        otp[i] = v.slice(-1);
        return { ...cur, otp };
      }),
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
  };

  return { state, actions, hydrated };
}

export type SalaryWiseActions = ReturnType<typeof useSalaryWise>['actions'];
