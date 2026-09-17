// ============================================================
// TRANSACTION DATA MODEL & STORAGE UTILITIES
// ============================================================

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  note: string;
  walletId: string;
  date: string;
  createdAt: string;
  updatedAt?: string;
}

const STORAGE_KEY = "montra_transactions_v1";

export function getTransactions(): Transaction[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved) as Transaction[];
  } catch {
    return [];
  }
}

export function getTransactionById(id: string): Transaction | undefined {
  return getTransactions().find((t) => t.id === id);
}

export function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function addTransaction(
  data: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
): Transaction {
  const now = new Date().toISOString();
  const newTransaction: Transaction = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: now,
  };
  const transactions = getTransactions();
  saveTransactions([...transactions, newTransaction]);
  window.dispatchEvent(new Event("montra:data-changed"));
  return newTransaction;
}

export function updateTransaction(updated: Transaction): Transaction {
  const transactions = getTransactions();
  const result = { ...updated, updatedAt: new Date().toISOString() };
  const updatedList = transactions.map((t) => (t.id === updated.id ? result : t));
  saveTransactions(updatedList);
  window.dispatchEvent(new Event("montra:data-changed"));
  return result;
}

export function deleteTransaction(id: string): void {
  const transactions = getTransactions();
  saveTransactions(transactions.filter((t) => t.id !== id));
  window.dispatchEvent(new Event("montra:data-changed"));
}
