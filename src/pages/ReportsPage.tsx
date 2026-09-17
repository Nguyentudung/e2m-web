import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDown01Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Calendar } from "@/components/ui/calendar";
import { vi } from "react-day-picker/locale";
import {
  calculateExpense,
  calculateIncome,
  filterTransactionsByDateRange,
  formatRangeLabel,
  groupExpensesByCategory,
  groupTransactionsByDate,
  resolveDateRange,
  type DateRange,
  type DateRangeKey,
} from "@/lib/reports";
import { getTransactions } from "@/types/transactions";
import { formatCurrency } from "@/utils/currency";

const filters: { key: DateRangeKey; label: string }[] = [
  { key: "today", label: "Hôm nay" },
  { key: "7days", label: "7 ngày" },
  { key: "thisMonth", label: "Tháng này" },
  { key: "3months", label: "3 tháng" },
  { key: "6months", label: "6 tháng" },
  { key: "year", label: "1 năm" },
  { key: "custom", label: "Tùy chỉnh" },
];

function startOfDay(d: Date) {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}
function endOfDay(d: Date) {
  const r = new Date(d);
  r.setHours(23, 59, 59, 999);
  return r;
}

function ReportsPage() {
  const navigate = useNavigate();
  const [rangeKey, setRangeKey] = useState<DateRangeKey>("thisMonth");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const sync = () => setRevision((item) => item + 1);
    window.addEventListener("montra:data-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("montra:data-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const data = useMemo(() => {
    const range = resolveDateRange(rangeKey, customRange);
    const transactions = filterTransactionsByDateRange(getTransactions(), range);
    return {
      transactions,
      bars: groupTransactionsByDate(transactions, range),
      categories: groupExpensesByCategory(transactions),
      income: calculateIncome(transactions),
      expense: calculateExpense(transactions),
    };
  }, [rangeKey, customRange, revision]);

  const applyRange = (key: DateRangeKey) => {
    if (key === "custom") {
      setCustomRange((prev) => prev ?? { from: startOfDay(new Date()), to: endOfDay(new Date()) });
      return;
    }
    setRangeKey(key);
    setPickerOpen(false);
  };

  if (!data.transactions.length) {
    return (
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 pb-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-surface">
          <HugeiconsIcon
            icon={Calendar03Icon}
            size={30}
            strokeWidth={1.6}
            className="text-text-tertiary"
          />
        </span>
        <p className="mt-4 text-lg font-bold">Chưa có dữ liệu</p>
        <p className="mt-2 text-sm text-text-secondary">
          Thêm giao dịch để xem báo cáo.
        </p>
        <Button onClick={() => navigate("/add")} className="mt-5 rounded-full px-6">
          Ghi giao dịch
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-28 pt-3">
      {/* HEADER – CHỌN KHOẢNG THỜI GIAN */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="flex h-11 items-center gap-1.5 rounded-full bg-surface px-5 text-base font-semibold"
        >
          {formatRangeLabel(rangeKey, customRange)}
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={18}
            strokeWidth={2}
            className="text-text-secondary"
          />
        </button>
      </div>

      {/* METRICS */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        <Metric label="Tiền nhận" value={data.income} tone="text-green-base-300" />
        <Metric label="Tiền chi" value={data.expense} tone="text-red-base-300" />
        <Metric
          label="Chênh lệch"
          value={data.income - data.expense}
          tone="text-text-primary"
        />
      </div>

      {/* BAR CHART */}
      <section className="mt-5 rounded-2xl bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">Thu và chi</h2>
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[var(--chart-3)]" />
              Thu
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[var(--chart-4)]" />
              Chi
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.bars} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
              minTickGap={16}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={44} />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value), "VND")}
              contentStyle={{
                background: "var(--surface-secondary)",
                border: "none",
                borderRadius: 12,
              }}
              cursor={{ fill: "var(--surface-secondary)", opacity: 0.5 }}
            />
            <Bar dataKey="income" name="Thu" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Chi" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* PIE CHART */}
      {data.categories.length > 0 && (
        <section className="mt-5 rounded-2xl bg-surface p-4">
          <h2 className="mb-3 font-bold">Chi tiêu theo danh mục</h2>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <ResponsiveContainer width="100%" height={200} className="sm:max-w-[240px]">
              <PieChart>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value), "VND")}
                  contentStyle={{
                    background: "var(--surface-secondary)",
                    border: "none",
                    borderRadius: 12,
                  }}
                />
                <Pie
                  data={data.categories}
                  dataKey="amount"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={86}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {data.categories.map((item) => (
                    <Cell key={item.categoryId} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <ul className="w-full flex-1 space-y-1.5">
              {data.categories.map((item) => (
                <li key={item.categoryId} className="flex items-center gap-2 text-sm">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="min-w-0 flex-1 truncate text-text-secondary">
                    {item.name}
                  </span>
                  <span className="shrink-0 font-semibold">
                    {item.percentage.toFixed(0)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* DATE RANGE DRAWER */}
      <Drawer open={pickerOpen} onOpenChange={setPickerOpen}>
        <DrawerContent className="mx-auto max-w-2xl rounded-t-3xl bg-background">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-lg font-bold">Khoảng thời gian</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col items-center gap-4 px-4 pb-6">
            <div className="grid w-full max-w-sm grid-cols-3 gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => applyRange(filter.key)}
                  className={`flex h-11 items-center justify-center gap-1 rounded-xl text-sm font-semibold transition-colors ${
                    rangeKey === filter.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface text-text-secondary"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {rangeKey === "custom" && customRange?.from && (
              <>
                <Calendar
                  mode="range"
                  selected={{ from: customRange.from, to: customRange.to }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setCustomRange({ from: startOfDay(range.from), to: endOfDay(range.to) });
                    }
                  }}
                  numberOfMonths={1}
                  fixedWeeks
                  locale={vi}
                  className="w-full max-w-sm"
                />
                <Button
                  onClick={() => setPickerOpen(false)}
                  className="h-12 w-full max-w-sm rounded-xl text-base"
                >
                  Áp dụng
                </Button>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </section>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-xl bg-surface p-3">
      <p className="text-xs text-text-secondary">{label}</p>
      <p className={`mt-1 truncate font-bold ${tone}`}>{formatCurrency(value, "VND")}</p>
    </div>
  );
}
export default ReportsPage;
