import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Wallet01Icon,
  ArrowUp02Icon,
  ArrowDown02Icon,
  Tick02Icon,
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
import NumberPad from "@/components/transactions/NumberPad";
import { getCategoriesByType } from "@/constants/categories";
import CategoryPicker from "@/components/transactions/CategoryPicker";
import { toast } from "@/components/ui/toast";
import { saveTransaction } from "@/services/transactionService";
import { getCurrencySymbol } from "@/utils/currency";
import { getWallets, type Wallet } from "@/types/wallets";

export interface TransactionDraft {
  type: "income" | "expense";
  amountText: string;
  categoryId: string;
  walletId: string;
  note: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

const todayISO = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const currentTime = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function shiftDays(iso: string, days: number): string {
  const d = parseDate(iso);
  d.setDate(d.getDate() + days);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function walletName(wallet?: Wallet): string {
  if (!wallet) return "Chọn tài khoản";
  return (
    wallet.assetName ??
    wallet.assetId ??
    (wallet.type === "cash" ? "Tiền mặt" : "Tài khoản")
  );
}

export default function AddTransactionPage() {
  const navigate = useNavigate();
  const state = useLocation().state as { draft?: TransactionDraft } | null;
  const initial = state?.draft;

  const [type, setType] = useState<"income" | "expense">(initial?.type ?? "expense");
  const [amountText, setAmountText] = useState(initial?.amountText ?? "0");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [walletId] = useState(initial?.walletId ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [date, setDate] = useState(initial?.date ?? todayISO);
  const [time, setTime] = useState(initial?.time ?? currentTime);

  const [noteFocused, setNoteFocused] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const amount = Number(amountText) || 0;
  const formattedAmount = amount.toLocaleString("vi-VN");
  const categories = getCategoriesByType(type);
  const wallets = useMemo(() => getWallets(), []);
  const wallet = wallets.find((w) => w.id === walletId);

  const draft = (): TransactionDraft => ({
    type,
    amountText,
    categoryId,
    walletId,
    note,
    date,
    time,
  });

  const goTo = (path: string) =>
    navigate(path, { state: { draft: draft() } });

  const save = () => {
    if (amount <= 0 || !categoryId || !walletId) {
      toast.add({
        title: "Không thể lưu giao dịch",
        description: "Hãy chọn danh mục, tài khoản và nhập số tiền.",
        type: "error",
      });
      return;
    }
    try {
      saveTransaction({
        type,
        amount,
        categoryId,
        walletId,
        note: note.trim(),
        date: `${date}T${time}:00`,
      });
      toast.add({ title: "Đã lưu giao dịch", type: "success" });
      navigate("/home");
    } catch (error) {
      toast.add({
        title: "Không thể lưu giao dịch",
        description: error instanceof Error ? error.message : undefined,
        type: "error",
      });
    }
  };

  const hour = Number(time.slice(0, 2));
  const minute = Number(time.slice(3, 5));
  const pad = (n: number) => String(n).padStart(2, "0");
  const setTimeParts = (h: number, m: number) =>
    setTime(`${pad(Math.max(0, Math.min(23, h)))}:${pad(Math.max(0, Math.min(59, m)))}`);

  const presets: { label: string; value: string }[] = [
    { label: "Hôm qua", value: shiftDays(todayISO(), -1) },
    { label: "Hôm nay", value: todayISO() },
    { label: "Ngày mai", value: shiftDays(todayISO(), 1) },
  ];

  return (
    <section className="mx-auto flex h-[100dvh] w-full max-w-2xl flex-col bg-background">
      {/* ================= HEADER ================= */}
      <header className="relative flex shrink-0 items-center px-4 pt-4 pb-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Quay lại"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface transition active:scale-95"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={22} strokeWidth={2} />
        </button>
        <h1 className="pointer-events-none absolute inset-x-0 text-center text-xl font-bold tracking-tight">
          Ghi chép
        </h1>
      </header>

      {/* ================= CONTENT ================= */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
        {/* LOẠI GIAO DỊCH */}
        <div className="mt-2 grid grid-cols-2 border-b border-border">
          {(["expense", "income"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setType(item);
                if (!categories.some((entry) => entry.id === categoryId)) setCategoryId("");
              }}
              className="relative h-11 border-b-2 border-transparent text-sm font-semibold text-text-primary"
            >
              {item === "expense" ? "Chi tiêu" : "Thu nhập"}
              <span
                aria-hidden="true"
                className={`absolute bottom-[-2px] left-1/2 h-0.5 w-12 -translate-x-1/2 origin-center rounded-full bg-primary transition-transform duration-300 ease-out ${
                  type === item ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          ))}
        </div>
        <div className="py-6 text-center">
          <p className="break-all text-5xl font-bold tracking-tight tabular-nums">
            {formattedAmount} {getCurrencySymbol("VND")}
          </p>
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            onFocus={() => setNoteFocused(true)}
            onBlur={() => setNoteFocused(false)}
            placeholder={noteFocused ? "" : "Thêm ghi chú"}
            aria-label="Ghi chú giao dịch"
            className="mt-4 w-full border-b border-border bg-transparent px-2 py-2 text-center text-base outline-none placeholder:text-text-secondary focus:placeholder:text-transparent caret-primary focus:border-primary"
          />
        </div>
        <button
          type="button"
          onClick={() => goTo("/add/wallet")}
          className="flex min-h-14 w-full items-center gap-3 rounded-xl bg-surface px-4 text-left"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-surface-secondary">
            <HugeiconsIcon
              icon={Wallet01Icon}
              size={20}
              strokeWidth={1.8}
              className={wallet ? "text-primary" : "text-text-secondary"}
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-text-secondary">Tài khoản</span>
            <span className="block truncate font-semibold">{walletName(wallet)}</span>
          </span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="shrink-0 text-text-tertiary" />
        </button>
        <div className="mt-4 pb-2">
          <p className="mb-2 px-1 text-sm font-semibold text-text-secondary">Danh mục</p>
          <CategoryPicker categories={categories} selected={categoryId} onSelect={setCategoryId} />
        </div>
      </div>

      {/* ================= KEYPAD ================= */}
      {!noteFocused && (
        <div className="shrink-0 px-2 pb-[calc(10px+env(safe-area-inset-bottom))] pt-1">
          <NumberPad
            value={amountText}
            onChange={setAmountText}
            onToday={() => setDateOpen(true)}
            onOperator={(operator) => setType(operator)}
            onConfirm={save}
          />
        </div>
      )}

      {/* ================= NGÀY GIAO DỊCH DRAWER ================= */}
      <Drawer open={dateOpen} onOpenChange={setDateOpen}>
        <DrawerContent className="mx-auto h-[min(94dvh,48rem)] max-h-[94dvh] max-w-2xl overflow-hidden rounded-t-3xl bg-background [&_[data-slot=drawer-content]]:overflow-y-auto [&_[data-slot=drawer-content]]:overscroll-contain [&_[data-slot=drawer-content]]:touch-pan-y">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain touch-pan-y">
            <DrawerHeader className="text-left">
              <DrawerTitle className="text-lg font-bold">Ngày giao dịch</DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col items-center gap-4 px-4 pb-6">
            <Calendar
              mode="single"
              selected={parseDate(date)}
              onSelect={(day) => {
                if (!day) return;
                const y = day.getFullYear();
                const m = String(day.getMonth() + 1).padStart(2, "0");
                const d = String(day.getDate()).padStart(2, "0");
                setDate(`${y}-${m}-${d}`);
              }}
              month={parseDate(date)}
              onMonthChange={(month) => {
                const y = month.getFullYear();
                const m = String(month.getMonth() + 1).padStart(2, "0");
                setDate(`${y}-${m}-${date.slice(8, 10)}`);
              }}
              fixedWeeks
              locale={vi}
              className="w-full max-w-sm"
            />

            {/* PRESETS */}
            <div className="grid w-full max-w-sm grid-cols-3 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setDate(preset.value)}
                  className={`h-10 rounded-xl text-sm font-semibold transition-colors ${
                    date === preset.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface text-text-secondary"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* TIME PICKER */}
            <div className="flex w-full max-w-sm items-center justify-center gap-3 rounded-2xl bg-surface p-4">
              <TimeSpinner
                label="Giờ"
                value={hour}
                min={0}
                max={23}
                onChange={(h) => setTimeParts(h, minute)}
              />
              <span className="text-3xl font-bold text-text-secondary">:</span>
              <TimeSpinner
                label="Phút"
                value={minute}
                min={0}
                max={59}
                onChange={(m) => setTimeParts(hour, m)}
              />
            </div>

            <Button
              onClick={() => setDateOpen(false)}
              className="h-12 w-full max-w-sm rounded-xl text-base"
            >
              <HugeiconsIcon icon={Tick02Icon} size={20} strokeWidth={2.2} />
              Xong
            </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </section>
  );
}

function TimeSpinner({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        aria-label={`Tăng ${label}`}
        onClick={() => onChange(clamp(value + 1))}
        className="flex size-10 items-center justify-center rounded-full transition active:scale-95 hover:bg-surface-secondary"
      >
        <HugeiconsIcon icon={ArrowUp02Icon} size={18} strokeWidth={2} />
      </button>
      <span className="w-14 text-center text-3xl font-bold tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <button
        type="button"
        aria-label={`Giảm ${label}`}
        onClick={() => onChange(clamp(value - 1))}
        className="flex size-10 items-center justify-center rounded-full transition active:scale-95 hover:bg-surface-secondary"
      >
        <HugeiconsIcon icon={ArrowDown02Icon} size={18} strokeWidth={2} />
      </button>
    </div>
  );
}
