import { useState } from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

import {
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldSeparator,
} from "@/components/ui/field";

import AssetTypeField from "./CreateWallet/AssetTypeField";
import AssetSelectorField from "./CreateWallet/AssetSelectorField";
import BalanceField from "./CreateWallet/BalanceField";
import CurrencyField from "./CreateWallet/CurrencyField";
import NoteField from "./CreateWallet/NoteField";
import CreateWalletActions from "./CreateWallet/CreateWalletActions";

export type AssetType = "cash" | "bank" | "ewallet" | "card";

export interface SelectedAsset {
  type: AssetType;
  id?: string;
  name?: string;
  icon?: string;
}

interface CreateWalletPageProps {
  selectedAsset: SelectedAsset | null;
  onBack: () => void;
  onSelectBank: () => void;
  onSelectEwallet: () => void;
  onSelectCard: () => void;

  onSave: (data: {
    type: AssetType;
    assetId?: string;
    balance: number;
    currency: string;
    note: string;
  }) => void;
}

function CreateWalletPage({
  selectedAsset,
  onBack,
  onSelectBank,
  onSelectEwallet,
  onSelectCard,
  onSave,
}: CreateWalletPageProps) {
  const [type, setType] = useState<AssetType>("cash");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("VND");
  const [note, setNote] = useState("");

  const handleAssetTypeChange = (newType: AssetType) => {
    setType(newType);

    if (newType === "bank") {
      onSelectBank();
    }

    if (newType === "ewallet") {
      onSelectEwallet();
    }

    if (newType === "card") {
      onSelectCard();
    }
  };

  const handleSelectAsset = () => {
    if (type === "bank") {
      onSelectBank();
    }

    if (type === "ewallet") {
      onSelectEwallet();
    }

    if (type === "card") {
      onSelectCard();
    }
  };

  const handleSubmit = () => {
    const numericBalance = Number(balance);

    if (
      balance === "" ||
      !Number.isFinite(numericBalance) ||
      numericBalance < 0
    ) {
      return;
    }

    onSave({
      type,

      // Chỉ lưu ID của tài sản.
      // Ví dụ ngân hàng Woori -> "woori"
      assetId: selectedAsset?.id,

      balance: numericBalance,
      currency,
      note: note.trim(),
    });
  };

  return (
    <section className="flex h-[100dvh] flex-col overflow-hidden bg-surface">
      {/* ================= HEADER ================= */}
      <div
        className="
          relative
          shrink-0
          rounded-b-[32px]
          bg-background
          px-4
          pt-4
          pb-3
          sm:px-8
        "
      >
        <div className="mx-auto w-full max-w-2xl">
          {/* NÚT BACK */}
          <button
            type="button"
            onClick={onBack}
            aria-label="Quay lại"
            className="
              flex
              size-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-surface
              text-text-primary
              transition
              hover:bg-surface/80
              active:scale-95
            "
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={22} strokeWidth={2} />
          </button>

          {/* TIÊU ĐỀ */}
          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              top-1/2
              -translate-y-1/2
              text-center
            "
          >
            <h1
              className="
                text-xl
                font-bold
                leading-tight
                tracking-tight
                text-text-primary
                sm:text-2xl
              "
            >
              Tạo ví mới
            </h1>
          </div>
        </div>
      </div>

      {/* ================= KHOẢNG CÁCH ================= */}
      <div className="h-2 shrink-0" />

      {/* ================= FORM ================= */}
      <form
        id="create-wallet-form"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overscroll-contain
          rounded-t-[32px]
          bg-background
          px-4
          pt-5
          pb-16
          sm:px-8
          sm:pt-8
          [&::-webkit-scrollbar]:hidden
          [scrollbar-width:none]
        "
      >
        <div className="mx-auto w-full max-w-2xl">
          <FieldGroup className="gap-5">
            {/* TÀI SẢN */}
            <FieldSet className="gap-4">
              <FieldLegend className="w-full text-center text-xl font-semibold sm:text-xl">
                Thông tin tài sản
              </FieldLegend>

              <FieldGroup className="gap-4">
                <AssetTypeField value={type} onChange={handleAssetTypeChange} />

                {type !== "cash" && (
                  <AssetSelectorField
                    type={type}
                    selectedAsset={selectedAsset}
                    selectedAssetIcon={selectedAsset?.icon}
                    onSelect={handleSelectAsset}
                  />
                )}
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            {/* SỐ DƯ */}
            <FieldSet className="gap-4">
              <FieldLegend className="text-lg font-semibold sm:text-xl">
                Số dư ban đầu
              </FieldLegend>

              <FieldDescription className="text-sm sm:text-base">
                Nhập số tiền hiện có trong tài sản này.
              </FieldDescription>

              <div className="grid grid-cols-2 gap-3">
                <BalanceField
                  value={balance}
                  currency={currency}
                  onChange={setBalance}
                />

                <CurrencyField value={currency} onChange={setCurrency} />
              </div>
            </FieldSet>

            <FieldSeparator />

            {/* GHI CHÚ */}
            <FieldSet className="gap-4">
              <FieldLegend className="text-lg font-semibold sm:text-xl">
                Ghi chú
              </FieldLegend>

              <FieldDescription className="text-sm sm:text-base">
                Thêm thông tin để dễ nhận biết tài sản sau này.
              </FieldDescription>

              <FieldGroup className="gap-4">
                <NoteField value={note} onChange={setNote} />
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />
          </FieldGroup>
        </div>
      </form>

      {/* ================= ACTION ================= */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-4 sm:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <div className="pointer-events-auto">
            <CreateWalletActions
              disabled={!balance || (type !== "cash" && !selectedAsset?.id)}
              onCancel={onBack}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreateWalletPage;
