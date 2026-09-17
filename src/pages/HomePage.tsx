import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
  ArrowUp01Icon,
  Calendar03Icon,
  Wallet05Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import TransactionItem from "@/components/transactions/TransactionItem";
import { filterTransactionsByDateRange } from "@/lib/reports";
import { getTransactions } from "@/types/transactions";
import { getWallets } from "@/types/wallets";
import { formatCurrency } from "@/utils/currency";
import qcOne from "@/assets/images/qc_1.jpg";
import qcTwo from "@/assets/images/qc_2.jpg";

const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

function HomePage() {
  const navigate = useNavigate();
  const [monthOffset, setMonthOffset] = useState(0); // 0 = tháng này
  const [revision, setRevision] = useState(0);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const refresh = () => setRevision((value) => value + 1);
    window.addEventListener("montra:data-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("montra:data-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % 2), 5000);
    return () => window.clearInterval(timer);
  }, []);

  const { wallets, transactions, income, expense, month } = useMemo(() => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const to = new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 0, 23, 59, 59, 999);
    const allTransactions = getTransactions();
    const current = filterTransactionsByDateRange(allTransactions, { from, to });
    return {
      wallets: getWallets(),
      transactions: allTransactions,
      income: current.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
      expense: current.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
      month: from,
    };
  }, [monthOffset, revision]);

  const total = wallets.reduce(
    (sum, wallet) =>
      wallet.includeInTotal === false ? sum : sum + wallet.balance,
    0,
  );
  const recent = [...transactions]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 8);

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 sm:px-6">
      <header className="mb-5">
        <p className="text-sm capitalize text-text-secondary">
          {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <h1 className="text-2xl font-bold">Tổng quan tài chính</h1>
      </header>

      {/* TỔNG QUAN */}
      <div className="rounded-2xl bg-surface p-5">
        <p className="text-sm text-text-secondary">Tổng tài sản</p>
        <p className="mt-1 text-3xl font-bold">{formatCurrency(total, "VND")}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-background p-3">
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <HugeiconsIcon icon={ArrowUp01Icon} size={15} className="text-green-base-300" />
              Tiền nhận
            </div>
            <p className="mt-1 font-bold text-green-base-300">
              +{formatCurrency(income, "VND")}
            </p>
          </div>
          <div className="rounded-xl bg-background p-3">
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <HugeiconsIcon icon={ArrowDown01Icon} size={15} className="text-red-base-300" />
              Tiền chi
            </div>
            <p className="mt-1 font-bold text-red-base-300">
              -{formatCurrency(expense, "VND")}
            </p>
          </div>
        </div>
      </div>

      {/* CHỌN THÁNG + XEM LỊCH */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-full bg-surface p-1">
          <button
            type="button"
            onClick={() => setMonthOffset((v) => v - 1)}
            aria-label="Tháng trước"
            className="flex size-9 items-center justify-center rounded-full transition active:scale-95 hover:bg-surface-secondary"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={18} strokeWidth={2} />
          </button>
          <span className="min-w-[104px] text-center text-sm font-semibold">
            {MONTH_NAMES[month.getMonth()]}
            {month.getFullYear() !== new Date().getFullYear()
              ? ` ${month.getFullYear()}`
              : ""}
          </span>
          <button
            type="button"
            onClick={() => setMonthOffset((v) => v + 1)}
            aria-label="Tháng sau"
            className="flex size-9 items-center justify-center rounded-full transition active:scale-95 hover:bg-surface-secondary"
          >
            <HugeiconsIcon icon={ArrowRight02Icon} size={18} strokeWidth={2} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate("/calendar")}
          aria-label="Xem lịch"
          className="flex h-11 items-center gap-2 rounded-full bg-surface px-4 text-sm font-semibold transition active:scale-95"
        >
          <HugeiconsIcon icon={Calendar03Icon} size={19} strokeWidth={1.9} />
          Lịch
        </button>
      </div>

      {/* QUẢNG CÁO CAROUSEL */}
      <div
        className="relative mt-5 overflow-hidden rounded-2xl bg-surface"
        onTouchEnd={() => setSlide((current) => (current + 1) % 2)}
      >
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${slide * 100}%)` }}
        >
          {[qcOne, qcTwo].map((image, index) => (
            <img
              key={image}
              src={image}
              alt={`Mẹo quản lý tài chính ${index + 1}`}
              className="aspect-[2.2/1] w-full shrink-0 object-cover"
            />
          ))}
        </div>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {[0, 1].map((index) => (
            <button
              key={index}
              type="button"
              aria-label={`Hiển thị banner ${index + 1}`}
              onClick={() => setSlide(index)}
              className={`h-1.5 rounded-full transition-all ${
                slide === index ? "w-5 bg-primary" : "w-1.5 bg-surface"
              }`}
            />
          ))}
        </div>
      </div>

      {/* GIAO DỊCH GẦN ĐÂY */}
      <div className="mt-7 flex items-center justify-between">
        <h2 className="text-lg font-bold">Giao dịch gần đây</h2>
        <Button
          variant="ghost"
          onClick={() => navigate("/add")}
          aria-label="Thêm giao dịch"
        >
          <HugeiconsIcon icon={Add01Icon} size={19} />
          Thêm
        </Button>
      </div>

      {recent.length ? (
        <div className="mt-3 space-y-2">
          {recent.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              wallets={wallets}
            />
          ))}
        </div>
      ) : (
        <div className="mt-3 flex flex-col items-center rounded-2xl bg-surface p-8 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-background">
            <HugeiconsIcon
              icon={Wallet05Icon}
              size={30}
              strokeWidth={1.6}
              className="text-text-tertiary"
            />
          </span>
          <p className="mt-4 font-semibold">Không có bản ghi nào cho hôm nay</p>
          <button
            type="button"
            onClick={() => navigate("/add")}
            aria-label="Thêm giao dịch"
            className="mt-5 flex size-12 items-center justify-center rounded-full bg-primary-accent text-primary-accent-text transition active:scale-95"
          >
            <HugeiconsIcon icon={Add01Icon} size={24} strokeWidth={2.4} />
          </button>
        </div>
      )}
    </section>
  );
}
export default HomePage;
