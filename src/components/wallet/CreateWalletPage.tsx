import { useState } from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Building03Icon,
  CreditCardIcon,
  SmartPhone01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AssetType = "cash" | "bank" | "ewallet" | "card";

interface SelectedAsset {
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
    assetName?: string;
    assetIcon?: string;
    balance: number;
    currency: string;
    note: string;
  }) => void;
}

const assetTypes = [
  {
    type: "cash" as const,
    label: "Tiền mặt",
    icon: Wallet01Icon,
  },
  {
    type: "bank" as const,
    label: "Ngân hàng",
    icon: Building03Icon,
  },
  {
    type: "ewallet" as const,
    label: "Ví điện tử",
    icon: SmartPhone01Icon,
  },
  {
    type: "card" as const,
    label: "Thẻ",
    icon: CreditCardIcon,
  },
];

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

  const handleAssetClick = (selectedType: AssetType) => {
    setType(selectedType);

    if (selectedType === "bank") {
      onSelectBank();
      return;
    }

    if (selectedType === "ewallet") {
      onSelectEwallet();
      return;
    }

    if (selectedType === "card") {
      onSelectCard();
      return;
    }
  };

  const handleSave = () => {
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
      assetId: selectedAsset?.id,
      assetName: selectedAsset?.name,
      assetIcon: selectedAsset?.icon,
      balance: numericBalance,
      currency,
      note: note.trim(),
    });
  };

  const hasSelectedSpecificAsset =
    type === "cash" || selectedAsset?.type === type;

  return (
    <section className="min-h-[75vh] px-4 pb-28 pt-5 sm:px-6 sm:pt-7">
      <div className="mx-auto w-full max-w-xl">
        {/* HEADER */}
        <div className="mb-7 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Quay lại"
            className="
              flex size-11 shrink-0 items-center justify-center
              rounded-full
              border border-white/10
              bg-surface/90
              text-text-primary
              backdrop-blur-xl
              shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
              transition-all duration-200
              hover:bg-surface
              active:scale-95
            "
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={21} strokeWidth={2} />
          </button>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              Tạo ví mới
            </h1>

            <p className="mt-0.5 text-xs text-text-secondary sm:text-sm">
              Thêm một tài sản vào Montra
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* LOẠI TÀI SẢN */}
          <div>
            <Label className="mb-2.5 block px-1 text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Loại tài sản
            </Label>

            <div
              className="
                flex w-full gap-1.5 overflow-x-auto
                rounded-full
                border border-white/10
                bg-surface/90
                p-1.5
                backdrop-blur-xl
                shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
                scrollbar-none
              "
            >
              {assetTypes.map((asset) => {
                const selected = type === asset.type;

                return (
                  <button
                    key={asset.type}
                    type="button"
                    onClick={() => handleAssetClick(asset.type)}
                    className={`
                      flex h-11 min-w-max flex-1 items-center justify-center
                      gap-1.5 rounded-full px-3
                      text-xs font-semibold
                      transition-all duration-200 ease-out
                      ${
                        selected
                          ? `
                            bg-background
                            text-text-primary
                            shadow-[inset_0_1px_2px_rgba(255,255,255,0.06)]
                          `
                          : `
                            text-text-secondary
                            hover:bg-white/5
                            hover:text-text-primary
                          `
                      }
                    `}
                  >
                    <HugeiconsIcon
                      icon={asset.icon}
                      size={18}
                      strokeWidth={selected ? 2.2 : 1.8}
                    />

                    <span>{asset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* NGÂN HÀNG / VÍ / THẺ */}
          {type !== "cash" && (
            <div>
              <Label className="mb-2.5 block px-1 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                {type === "bank"
                  ? "Ngân hàng"
                  : type === "ewallet"
                    ? "Ví điện tử"
                    : "Loại thẻ"}
              </Label>

              {hasSelectedSpecificAsset ? (
                <button
                  type="button"
                  onClick={() => {
                    if (type === "bank") {
                      onSelectBank();
                    }

                    if (type === "ewallet") {
                      onSelectEwallet();
                    }

                    if (type === "card") {
                      onSelectCard();
                    }
                  }}
                  className="
                    group flex w-full items-center gap-3
                    rounded-2xl
                    border border-white/10
                    bg-surface/90
                    p-2.5
                    text-left
                    backdrop-blur-xl
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
                    transition-all duration-200
                    hover:bg-surface
                    active:scale-[0.99]
                  "
                >
                  <div
                    className="
                      flex size-11 shrink-0 items-center justify-center
                      overflow-hidden
                      rounded-xl
                      bg-background
                    "
                  >
                    {selectedAsset?.icon ? (
                      <img
                        src={selectedAsset.icon}
                        alt=""
                        className="size-7 object-contain"
                      />
                    ) : (
                      <HugeiconsIcon
                        icon={
                          type === "bank"
                            ? Building03Icon
                            : type === "ewallet"
                              ? SmartPhone01Icon
                              : CreditCardIcon
                        }
                        size={21}
                        strokeWidth={1.8}
                        className="text-text-secondary"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-primary">
                      {selectedAsset?.name ?? "Chưa chọn"}
                    </p>

                    <p className="mt-0.5 text-[11px] text-text-secondary">
                      Nhấn để thay đổi
                    </p>
                  </div>

                  <span
                    className="
                      mr-1 rounded-full
                      px-3 py-1.5
                      text-[11px] font-semibold
                      text-text-secondary
                      transition-colors
                      group-hover:bg-white/5
                      group-hover:text-text-primary
                    "
                  >
                    Thay đổi
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (type === "bank") {
                      onSelectBank();
                    }

                    if (type === "ewallet") {
                      onSelectEwallet();
                    }

                    if (type === "card") {
                      onSelectCard();
                    }
                  }}
                  className="
                    flex w-full items-center justify-between
                    rounded-2xl
                    border border-dashed border-white/10
                    bg-surface/60
                    px-4 py-3.5
                    text-sm
                    text-text-secondary
                    backdrop-blur-xl
                    transition-all
                    hover:bg-surface
                    hover:text-text-primary
                  "
                >
                  <span>
                    Chọn{" "}
                    {type === "bank"
                      ? "ngân hàng"
                      : type === "ewallet"
                        ? "ví điện tử"
                        : "thẻ"}
                  </span>

                  <span className="text-xs font-semibold">Chọn</span>
                </button>
              )}
            </div>
          )}

          {/* SỐ DƯ */}
          <div>
            <Label
              htmlFor="wallet-balance"
              className="mb-2.5 block px-1 text-xs font-semibold uppercase tracking-wide text-text-secondary"
            >
              Số dư
            </Label>

            <div className="relative">
              <Input
                id="wallet-balance"
                type="number"
                min="0"
                step="any"
                value={balance}
                onChange={(event) => setBalance(event.target.value)}
                placeholder="0"
                className="
                  h-14
                  rounded-2xl
                  border-white/10
                  bg-surface/90
                  px-4
                  pr-16
                  text-lg
                  font-semibold
                  text-text-primary
                  backdrop-blur-xl
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
                  placeholder:text-text-secondary/50
                  focus-visible:border-primary-400/50
                  focus-visible:ring-1
                  focus-visible:ring-primary-400/20
                "
              />

              <span
                className="
                  pointer-events-none absolute
                  right-3 top-1/2 -translate-y-1/2
                  rounded-full
                  bg-background
                  px-3 py-1.5
                  text-xs font-bold
                  text-text-secondary
                "
              >
                {currency === "VND" ? "₫" : currency}
              </span>
            </div>
          </div>

          {/* TIỀN TỆ */}
          <div>
            <Label className="mb-2.5 block px-1 text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Đơn vị tiền tệ
            </Label>

            <Select
              value={currency}
              onValueChange={(value) => {
                if (value !== null) {
                  setCurrency(value);
                }
              }}
            >
              <SelectTrigger
                className="
                  h-14
                  w-full
                  rounded-2xl
                  border-white/10
                  bg-surface/90
                  px-4
                  text-sm
                  font-medium
                  text-text-primary
                  backdrop-blur-xl
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
                  focus:ring-1
                  focus:ring-primary-400/20
                "
              >
                <SelectValue placeholder="Chọn tiền tệ" />
              </SelectTrigger>

              <SelectContent className="rounded-2xl border-white/10 bg-surface/95 backdrop-blur-xl">
                <SelectItem value="VND">VND — Việt Nam Đồng</SelectItem>

                <SelectItem value="USD">USD — US Dollar</SelectItem>

                <SelectItem value="EUR">EUR — Euro</SelectItem>

                <SelectItem value="JPY">JPY — Japanese Yen</SelectItem>

                <SelectItem value="KRW">KRW — Korean Won</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* GHI CHÚ */}
          <div>
            <div className="mb-2.5 flex items-center justify-between px-1">
              <Label
                htmlFor="wallet-note"
                className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
              >
                Ghi chú
              </Label>

              <span className="text-[10px] text-text-secondary">
                {note.length}/200
              </span>
            </div>

            <Textarea
              id="wallet-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Ví dụ: Tiền tiêu hàng ngày..."
              maxLength={200}
              className="
                min-h-24
                resize-none
                rounded-2xl
                border-white/10
                bg-surface/90
                px-4
                py-3.5
                text-sm
                text-text-primary
                backdrop-blur-xl
                shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
                placeholder:text-text-secondary/50
                focus-visible:border-primary-400/50
                focus-visible:ring-1
                focus-visible:ring-primary-400/20
              "
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2.5 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="
                h-12
                rounded-full
                border-white/10
                bg-surface/90
                px-6
                text-sm
                font-semibold
                backdrop-blur-xl
                shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
                hover:bg-surface
                active:scale-95
              "
            >
              Hủy
            </Button>

            <Button
              type="button"
              onClick={handleSave}
              disabled={!balance || (type !== "cash" && !selectedAsset?.id)}
              className="
                h-12
                flex-1
                rounded-full
                bg-primary-accent
                px-6
                text-sm
                font-bold
                text-text-primary
                shadow-[inset_0_1px_2px_rgba(255,255,255,0.12)]
                transition-all duration-200
                hover:brightness-105
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              Tạo ví
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreateWalletPage;
