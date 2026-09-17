import {
  addTransaction,
  deleteTransaction,
  getTransactionById,
  updateTransaction,
  type Transaction,
} from "@/types/transactions";
import { applyWalletBalanceChange } from "@/types/wallets";

export type TransactionInput = Omit<Transaction, "id" | "createdAt" | "updatedAt">;

function walletEffect(transaction: Pick<Transaction, "type" | "amount">): number {
  return transaction.type === "income" ? transaction.amount : -transaction.amount;
}

export function saveTransaction(input: TransactionInput): Transaction {
  const transaction = addTransaction(input);
  applyWalletBalanceChange(transaction.walletId, walletEffect(transaction));
  return transaction;
}

export function editTransaction(updated: Transaction): Transaction {
  const previous = getTransactionById(updated.id);
  if (!previous) throw new Error("Không tìm thấy giao dịch");
  applyWalletBalanceChange(previous.walletId, -walletEffect(previous));
  applyWalletBalanceChange(updated.walletId, walletEffect(updated));
  return updateTransaction(updated);
}

export function removeTransaction(id: string): void {
  const transaction = getTransactionById(id);
  if (!transaction) throw new Error("Không tìm thấy giao dịch");
  applyWalletBalanceChange(transaction.walletId, -walletEffect(transaction));
  deleteTransaction(id);
}
