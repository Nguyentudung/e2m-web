import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar } from "@/components/ui/calendar";
import { vi } from "react-day-picker/locale";
import type { DayButton } from "react-day-picker";
import { getTransactions } from "@/types/transactions";
import { formatCurrency } from "@/utils/currency";

const toKey = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** Định dạng gọn: +1,2 tr / -50k */
function compactAmount(value: number): string {
  const sign = value < 0 ? "-" : "+";
  const abs = Math.abs(value);
  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(1).replace(/\.0$/, "")} tỷ`;
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(1).replace(/\.0$/, "")} tr`;
  if (abs >= 1e3) return `${sign}${Math.round(abs / 1e3)}k`;
  return `${sign}${abs}`;
}

function CalendarPage() {
  const navigate = useNavigate();
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const sync = () => setRevision((value) => value + 1);
    window.addEventListener("montra:data-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("montra:data-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const dailyNet = useMemo(() => {
    const map = new Map<string, number>();
    getTransactions().forEach((t) => {
      const key = toKey(new Date(t.date || t.createdAt));
      const effect = t.type === "income" ? t.amount : -t.amount;
      map.set(key, (map.get(key) ?? 0) + effect);
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revision]);

  const [month, setMonth] = useState(new Date());

  const monthTotal = useMemo(() => {
    let sum = 0;
    dailyNet.forEach((value, key) => {
      const [y, m] = key.split("-").map(Number);
      if (y === month.getFullYear() && m === month.getMonth() + 1) sum += value;
    });
    return sum;
  }, [dailyNet, month]);
  const DayWithTotal = ({ day, ...props }: React.ComponentProps<typeof DayButton>) => {
    const net = dailyNet.get(toKey(day.date));
    return (
      <button
        {...props}
        className="relative flex aspect-square size-auto w-full min-w-(--cell-size) flex-col items-center justify-center gap-0.5 rounded-(--cell-radius) leading-none font-normal outline-none transition-colors hover:bg-surface-secondary"
      >
        <span className="text-sm">{day.date.getDate()}</span>
        {net !== undefined && (
          <span
            className={`text-[9px] font-semibold tabular-nums ${
              net >= 0 ? "text-green-base-300" : "text-red-base-300"
            }`}
          >
            {compactAmount(net)}
          </span>
        )}
      </button>
    );
  };

  return (
    <section className="mx-auto min-h-[100dvh] w-full max-w-2xl px-4 pb-10 pt-5">
      <header className="relative mb-5 flex items-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Quay lại"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface transition active:scale-95"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={22} strokeWidth={2} />
        </button>
        <h1 className="pointer-events-none absolute inset-x-0 text-center text-lg font-bold">
          Lịch
        </h1>
      </header>

      <div className="flex items-center justify-between rounded-2xl bg-surface px-5 py-4">
        <span className="text-sm text-text-secondary">Tổng tháng này</span>
        <span
          className={`text-lg font-bold tabular-nums ${
            monthTotal > 0
              ? "text-green-base-300"
              : monthTotal < 0
                ? "text-red-base-300"
                : "text-text-primary"
          }`}
        >
          {monthTotal === 0 ? formatCurrency(0, "VND") : compactAmount(monthTotal)}
        </span>
      </div>

      <div className="mt-4 rounded-2xl bg-surface p-3">
        <Calendar
          mode="single"
          month={month}
          onMonthChange={setMonth}
          fixedWeeks
          locale={vi}
          components={{ DayButton: DayWithTotal }}
          className="mx-auto w-full"
        />
      </div>

      <p className="mt-4 text-center text-xs text-text-tertiary">
        Tổng mỗi ngày = tiền nhận − tiền chi
      </p>
    </section>
  );
}

export default CalendarPage;
