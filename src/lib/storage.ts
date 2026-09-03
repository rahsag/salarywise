import AsyncStorage from '@react-native-async-storage/async-storage';
import { NON_PERSISTED_KEYS, type AppState } from './types';

const STORAGE_KEY = 'salarywise:state';

export async function loadState(): Promise<Partial<AppState> | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    for (const key of NON_PERSISTED_KEYS) delete parsed[key];
    return parsed;
  } catch {
    return null;
  }
}

export async function saveState(state: AppState): Promise<void> {
  try {
    const toSave: Partial<AppState> = { ...state };
    for (const key of NON_PERSISTED_KEYS) delete toSave[key];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // best-effort persistence — ignore write failures
  }
}

export async function clearState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // best-effort — ignore failures
  }
}
