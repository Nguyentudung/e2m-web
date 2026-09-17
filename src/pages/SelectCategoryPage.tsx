import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import CategoryPicker from "@/components/transactions/CategoryPicker";
import { getCategoriesByType } from "@/constants/categories";
import type { TransactionDraft } from "@/pages/AddTransactionPage";

function SelectCategoryPage() {
  const navigate = useNavigate();
  const state = useLocation().state as { draft?: TransactionDraft } | null;
  const draft = state?.draft;
  const type = draft?.type ?? "expense";
  const choose = (categoryId: string) =>
    navigate("/add", {
      replace: true,
      state: {
        draft: {
          ...draft,
          type,
          amountText: draft?.amountText ?? "0",
          walletId: draft?.walletId ?? "",
          note: draft?.note ?? "",
          date: draft?.date ?? new Date().toISOString().slice(0, 10),
          time: draft?.time ?? "",
          categoryId,
        },
      },
    });

  return (
    <section className="mx-auto min-h-[100dvh] w-full max-w-2xl px-4 pb-10 pt-5">
      <header className="relative mb-7 flex items-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Quay lại"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface transition active:scale-95"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={22} strokeWidth={2} />
        </button>
        <div className="pointer-events-none absolute inset-x-0 text-center">
          <p className="text-xs text-text-secondary">
            {type === "expense" ? "Chi tiêu" : "Thu nhập"}
          </p>
          <h1 className="text-lg font-bold leading-tight">Chọn danh mục</h1>
        </div>
      </header>
      <CategoryPicker
        categories={getCategoriesByType(type)}
        selected={draft?.categoryId ?? ""}
        onSelect={choose}
      />
    </section>
  );
}
export default SelectCategoryPage;
