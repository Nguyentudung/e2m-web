import { HugeiconsIcon } from "@hugeicons/react";
import { getCategoryById } from "@/constants/categories";
import type { Transaction } from "@/types/transactions";
import type { Wallet } from "@/types/wallets";
import { formatCurrency } from "@/utils/currency";

interface TransactionItemProps {
  transaction: Transaction;
  wallets: Wallet[];
  onClick?: (transaction: Transaction) => void;
}

function formatTransactionDate(isoDate: string): string {
  const d = new Date(isoDate);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  if (isToday) {
    return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  }

  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function TransactionItem({ transaction, wallets, onClick }: TransactionItemProps) {
  const category = getCategoryById(transaction.categoryId);
  const wallet = wallets.find((w) => w.id === transaction.walletId);
  const isIncome = transaction.type === "income";

  return (
    <button
      type="button"
      onClick={() => onClick?.(transaction)}
      className="flex w-full items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-left transition-colors active:bg-surface-secondary"
    >
      {/* ICON */}
      <div
        className="flex size-11 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: (category?.color ?? "#B2BEC3") + "22" }}
      >
        {category && (
          <HugeiconsIcon
            icon={category.icon}
            size={22}
            strokeWidth={1.8}
            color={category.color ?? "#B2BEC3"}
          />
        )}
      </div>

      {/* INFO */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text-primary">
          {category?.name ?? transaction.categoryId}
        </p>
        <p className="truncate text-xs text-text-tertiary">
          {transaction.note
            ? `${transaction.note} · ${wallet?.assetId ?? "Vi"}`
            : (wallet?.assetId ?? "Vi")}
          {" · "}
          {formatTransactionDate(transaction.createdAt)}
        </p>
      </div>

      {/* AMOUNT */}
      <div className="shrink-0 text-right">
        <p
          className={`text-sm font-bold ${
            isIncome ? "text-green-base-300" : "text-red-base-300"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount, wallet?.currency ?? "VND")}
        </p>
      </div>
    </button>
  );
}
