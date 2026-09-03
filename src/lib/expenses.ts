import { addDoc, collection, deleteDoc, doc, getFirestore, onSnapshot, orderBy, query } from '@react-native-firebase/firestore';

export type ExpenseCategory = 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Other';

export interface ExpenseEntry {
  id: string;
  amount: number;
  category: ExpenseCategory;
  note: string;
  date: string; // 'YYYY-MM-DD'
}

const expensesCollection = (uid: string) => collection(getFirestore(), 'users', uid, 'expenses');

export async function addExpense(uid: string, entry: Omit<ExpenseEntry, 'id'>): Promise<void> {
  await addDoc(expensesCollection(uid), entry);
}

export async function deleteExpense(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(getFirestore(), 'users', uid, 'expenses', id));
}

// Kept as a live subscription (rather than a one-shot load, like the rest of
// AppState) since expenses are their own growing collection the user actively
// adds to while the Expenses screen is open — a one-shot load would miss
// entries added a moment ago until the next remount.
export function subscribeExpenses(uid: string, onChange: (entries: ExpenseEntry[]) => void): () => void {
  const q = query(expensesCollection(uid), orderBy('date', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      const entries = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ExpenseEntry, 'id'>) }));
      onChange(entries);
    },
    () => {
      // best-effort — mirrors the silent-fail contract of the rest of firestoreSync
    }
  );
}
