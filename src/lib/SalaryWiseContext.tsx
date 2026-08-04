import { createContext, useContext, type PropsWithChildren } from 'react';
import { useSalaryWise } from './useSalaryWise';
import type { AppState } from './types';
import type { SalaryWiseActions } from './useSalaryWise';

interface SalaryWiseContextValue {
  state: AppState;
  actions: SalaryWiseActions;
  hydrated: boolean;
}

const SalaryWiseContext = createContext<SalaryWiseContextValue | null>(null);

export function SalaryWiseProvider({ children }: PropsWithChildren) {
  const value = useSalaryWise();
  return <SalaryWiseContext.Provider value={value}>{children}</SalaryWiseContext.Provider>;
}

export function useSalaryWiseContext(): SalaryWiseContextValue {
  const ctx = useContext(SalaryWiseContext);
  if (!ctx) throw new Error('useSalaryWiseContext must be used within SalaryWiseProvider');
  return ctx;
}
