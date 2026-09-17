import {
  getTransactions,
  type Transaction,
} from "@/types/transactions";
import { getCategoryById } from "@/constants/categories";

// ============================================================
// DATE RANGE TYPES
// ============================================================

export type DateRangeKey =
  | "today"
  | "7days"
  | "thisMonth"
  | "lastMonth"
  | "3months"
  | "6months"
  | "year"
  | "custom";

export interface DateRange {
  from: Date;
  to: Date;
}

export interface DateRangeOption {
  key: DateRangeKey;
  label: string;
}

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { key: "today", label: "Hôm nay" },
  { key: "7days", label: "7 ngày" },
  { key: "thisMonth", label: "Tháng này" },
  { key: "3months", label: "3 tháng" },
  { key: "6months", label: "6 tháng" },
  { key: "year", label: "1 năm" },
  { key: "custom", label: "Tùy chỉnh" },
];

// ============================================================
// DATE RANGE RESOLUTION
// ============================================================

export function resolveDateRange(key: DateRangeKey, custom?: DateRange): DateRange {
  const now = new Date();
  const startOfDay = (d: Date) => {
    const r = new Date(d);
    r.setHours(0, 0, 0, 0);
    return r;
  };
  const endOfDay = (d: Date) => {
    const r = new Date(d);
    r.setHours(23, 59, 59, 999);
    return r;
  };

  switch (key) {
    case "today":
      return { from: startOfDay(now), to: endOfDay(now) };
    case "7days": {
      const from = new Date(now);
      from.setDate(now.getDate() - 6);
      return { from: startOfDay(from), to: endOfDay(now) };
    }
    case "thisMonth": {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: startOfDay(from), to: endOfDay(now) };
    }
    case "lastMonth": {
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const to = new Date(now.getFullYear(), now.getMonth(), 0);
      return { from: startOfDay(from), to: endOfDay(to) };
    }
    case "3months": {
      const from = new Date(now);
      from.setMonth(now.getMonth() - 3);
      return { from: startOfDay(from), to: endOfDay(now) };
    }
    case "6months": {
      const from = new Date(now);
      from.setMonth(now.getMonth() - 6);
      return { from: startOfDay(from), to: endOfDay(now) };
    }
    case "year": {
      const from = new Date(now);
      from.setMonth(now.getMonth() - 12);
      from.setDate(now.getDate() + 1);
      return { from: startOfDay(from), to: endOfDay(now) };
    }
    case "custom":
      return custom ?? { from: startOfDay(now), to: endOfDay(now) };
    default:
      return { from: startOfDay(now), to: endOfDay(now) };
  }
}

// ============================================================
// FILTER
// ============================================================

export function filterTransactionsByDateRange(
  transactions: Transaction[],
  range: DateRange,
): Transaction[] {
  return transactions.filter((t) => {
    const d = new Date(t.date || t.createdAt);
    return d >= range.from && d <= range.to;
  });
}

// ============================================================
// CALCULATIONS
// ============================================================

export function calculateIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateExpense(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateBalance(transactions: Transaction[]): number {
  return calculateIncome(transactions) - calculateExpense(transactions);
}

// ============================================================
// GROUP BY DATE (for bar chart)
// ============================================================

export interface DailyData {
  date: string;  // "DD/MM"
  income: number;
  expense: number;
}

export function groupTransactionsByDate(
  transactions: Transaction[],
  range: DateRange,
): DailyData[] {
  const map = new Map<string, DailyData>();

  // Pre-fill all dates in range
  const cur = new Date(range.from);
  cur.setHours(0, 0, 0, 0);
  const end = new Date(range.to);
  end.setHours(0, 0, 0, 0);

  // Limit to 31 days max for bar chart readability
  const diffMs = end.getTime() - cur.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;

  if (diffDays <= 31) {
    // Day-by-day
    const iter = new Date(cur);
    while (iter <= end) {
      const key = formatDateKey(iter);
      map.set(key, { date: key, income: 0, expense: 0 });
      iter.setDate(iter.getDate() + 1);
    }
  } else {
    // Month-by-month when range > 31 days
    const iterM = new Date(cur.getFullYear(), cur.getMonth(), 1);
    const endM = new Date(end.getFullYear(), end.getMonth(), 1);
    while (iterM <= endM) {
      const key = `${String(iterM.getMonth() + 1).padStart(2, "0")}/${iterM.getFullYear()}`;
      map.set(key, { date: key, income: 0, expense: 0 });
      iterM.setMonth(iterM.getMonth() + 1);
    }
  }

  // Fill actual data
  transactions.forEach((t) => {
    const d = new Date(t.date || t.createdAt);
    let key: string;

    if (diffDays <= 31) {
      key = formatDateKey(d);
    } else {
      key = `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    }

    const entry = map.get(key);
    if (!entry) return;

    if (t.type === "income") {
      entry.income += t.amount;
    } else {
      entry.expense += t.amount;
    }
  });

  return Array.from(map.values());
}

function formatDateKey(d: Date): string {
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// ============================================================
// GROUP BY CATEGORY (for pie chart)
// ============================================================

export interface CategoryData {
  categoryId: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export function groupExpensesByCategory(
  transactions: Transaction[],
): CategoryData[] {
  const expenses = transactions.filter((t) => t.type === "expense");
  const total = expenses.reduce((s, t) => s + t.amount, 0);

  if (total === 0) return [];

  const map = new Map<string, number>();
  expenses.forEach((t) => {
    map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
  });

  const items: CategoryData[] = [];
  map.forEach((amount, categoryId) => {
    const cat = getCategoryById(categoryId);
    items.push({
      categoryId,
      name: cat?.name ?? "Khác",
      amount,
      percentage: (amount / total) * 100,
      color: cat?.color ?? "var(--chart-5)",
    });
  });

  items.sort((a, b) => b.amount - a.amount);

  // If more than 6 categories, group the rest as "Khác"
  if (items.length > 6) {
    const top = items.slice(0, 5);
    const others = items.slice(5);
    const othersAmount = others.reduce((s, i) => s + i.amount, 0);
    top.push({
      categoryId: "other",
      name: "Khác",
      amount: othersAmount,
      percentage: (othersAmount / total) * 100,
      color: "var(--chart-5)",
    });
    return top;
  }

  return items;
}

// ============================================================
// CONVENIENCE: Get filtered from storage
// ============================================================

export function getFilteredTransactions(key: DateRangeKey, custom?: DateRange): Transaction[] {
  const range = resolveDateRange(key, custom);
  return filterTransactionsByDateRange(getTransactions(), range);
}

// ============================================================
// RANGE LABEL (header)
// ============================================================

const MONTH_LABELS_VI = [
  "Thg 1", "Thg 2", "Thg 3", "Thg 4", "Thg 5", "Thg 6",
  "Thg 7", "Thg 8", "Thg 9", "Thg 10", "Thg 11", "Thg 12",
];

export function formatRangeLabel(key: DateRangeKey, custom?: DateRange): string {
  const range = resolveDateRange(key, custom);

  switch (key) {
    case "today":
      return "Hôm nay";
    case "7days":
      return "7 ngày";
    case "thisMonth":
      return MONTH_LABELS_VI[range.from.getMonth()];
    case "lastMonth":
      return MONTH_LABELS_VI[range.from.getMonth()];
    case "year":
      return "1 năm";
    default:
      return `${formatDayMonth(range.from)} – ${formatDayMonth(range.to)}`;
  }
}

function formatDayMonth(d: Date): string {
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}
