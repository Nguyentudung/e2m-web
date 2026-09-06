import { useState } from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Delete02Icon,
  SaveIcon,
} from "@hugeicons/core-free-icons";

import {
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldSeparator,
} from "@/components/ui/field";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AssetTypeField from "./CreateWallet/AssetTypeField";
import AssetSelectorField from "./CreateWallet/AssetSelectorField";
import BalanceField from "./CreateWallet/BalanceField";
import CurrencyField from "./CreateWallet/CurrencyField";
import NoteField from "./CreateWallet/NoteField";

import type { Wallet, WalletType } from "@/types/wallets";

export interface SelectedWalletAsset {
  type: WalletType;
  id?: string;
  name?: string;
  icon?: string;
}

interface WalletInformationPageProps {
  wallet: Wallet;
  selectedAsset: SelectedWalletAsset | null;

  onBack: () => void;

  onSelectBank: () => void;
  onSelectEwallet: () => void;
  onSelectCard: () => void;

  onSave: (data: {
    type: WalletType;
    assetId?: string;
    balance: number;
    currency: string;
    note: string;
  }) => void;

  onDelete: () => void;
}

function WalletInformationPage({
  wallet,
  selectedAsset,
  onBack,
  onSelectBank,
  onSelectEwallet,
  onSelectCard,
  onSave,
  onDelete,
}: WalletInformationPageProps) {
  const [type, setType] = useState<WalletType>(wallet.type);
  const [balance, setBalance] = useState(String(wallet.balance));
  const [currency, setCurrency] = useState(wallet.currency);
  const [note, setNote] = useState(wallet.note);

  // ==================================================
  // DIALOG STATE
  // ==================================================

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  // ==================================================
  // ASSET TYPE
  // ==================================================

  const handleAssetTypeChange = (newType: WalletType) => {
    setType(newType);

    if (newType === "cash") {
      return;
    }

    if (newType === "bank") {
      onSelectBank();
      return;
    }

    if (newType === "ewallet") {
      onSelectEwallet();
      return;
    }

    if (newType === "card") {
      onSelectCard();
    }
  };

  const handleSelectAsset = () => {
    if (type === "bank") {
      onSelectBank();
      return;
    }

    if (type === "ewallet") {
      onSelectEwallet();
      return;
    }

    if (type === "card") {
      onSelectCard();
    }
  };

  // ==================================================
  // SAVE
  // ==================================================

  const handleSubmit = () => {
    const numericBalance = Number(balance);

    if (
      balance === "" ||
      !Number.isFinite(numericBalance) ||
      numericBalance < 0
    ) {
      return;
    }

    setIsSaveDialogOpen(true);
  };

  const handleConfirmSave = () => {
    const numericBalance = Number(balance);

    onSave({
      type,
      assetId:
        type === "cash" ? undefined : (selectedAsset?.id ?? wallet.assetId),
      balance: numericBalance,
      currency,
      note: note.trim(),
    });

    setIsSaveDialogOpen(false);
  };

  // ==================================================
  // DELETE
  // ==================================================

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleteDialogOpen(false);
    onDelete();
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <section className="flex h-[100dvh] flex-col overflow-hidden bg-surface">
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="relative shrink-0 rounded-b-[32px] bg-background px-4 pt-4 pb-3 sm:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <button
            type="button"
            onClick={onBack}
            aria-label="Quay lại"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface text-text-primary transition hover:bg-surface/80 active:scale-95"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={22} strokeWidth={2} />
          </button>

          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-text-primary sm:text-2xl">
              Thông tin ví
            </h1>
          </div>
        </div>
      </div>

      <div className="h-2 shrink-0" />

      {/* ================================================== */}
      {/* FORM */}
      {/* ================================================== */}

      <form
        id="wallet-information-form"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-t-[32px] bg-background px-4 pt-5 pb-32 sm:px-8 sm:pt-8 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      >
        <div className="mx-auto w-full max-w-2xl">
          <FieldGroup className="gap-5">
            {/* ================================================== */}
            {/* ASSET INFORMATION */}
            {/* ================================================== */}

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

            {/* ================================================== */}
            {/* BALANCE */}
            {/* ================================================== */}

            <FieldSet className="gap-4">
              <FieldLegend className="text-lg font-semibold sm:text-xl">
                Số dư
              </FieldLegend>

              <FieldDescription className="text-sm sm:text-base">
                Cập nhật số tiền hiện có trong tài sản này.
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

            {/* ================================================== */}
            {/* NOTE */}
            {/* ================================================== */}

            <FieldSet className="gap-4">
              <FieldLegend className="text-lg font-semibold sm:text-xl">
                Ghi chú
              </FieldLegend>

              <FieldDescription className="text-sm sm:text-base">
                Thêm hoặc chỉnh sửa thông tin để dễ nhận biết tài sản.
              </FieldDescription>

              <FieldGroup className="gap-4">
                <NoteField value={note} onChange={setNote} />
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />
          </FieldGroup>
        </div>
      </form>

      {/* ================================================== */}
      {/* BOTTOM ACTIONS */}
      {/* ================================================== */}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-4 sm:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <div className="pointer-events-auto flex items-center gap-3">
            {/* ================================================== */}
            {/* DELETE */}
            {/* ================================================== */}

            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              className="h-12 flex-1 rounded-full border-destructive/30 text-destructive hover:bg-destructive hover:text-light-base"
            >
              <HugeiconsIcon icon={Delete02Icon} size={20} strokeWidth={2} />
              Xóa ví
            </Button>

            {/* ================================================== */}
            {/* SAVE */}
            {/* ================================================== */}

            <Button
              type="submit"
              form="wallet-information-form"
              className="h-12 flex-1 rounded-full bg-primary-accent"
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* DELETE DIALOG */}
      {/* ================================================== */}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent
          className="
      w-[calc(100%-32px)]
      max-w-md
      rounded-[32px]
      border-0
      bg-background
      p-6
      shadow-none
      sm:p-8
    "
        >
          <DialogHeader className="items-center gap-3 text-center">
            {/* ICON */}
            <div className="flex size-20 items-center justify-center">
              <HugeiconsIcon
                icon={Delete02Icon}
                size={64}
                strokeWidth={1.5}
                className="text-destructive/40"
              />
            </div>

            <DialogTitle className="text-center text-2xl font-bold">
              Xóa ví?
            </DialogTitle>

            <DialogDescription className="text-center text-base leading-6">
              Bạn có chắc chắn muốn xóa ví này không?
              <br />
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-2 flex-row gap-3 sm:flex-row">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="
              h-12
              flex-1
              rounded-full
              border-0
              bg-muted
              text-text-primary
              hover:bg-muted/80
            "
                >
                  Không
                </Button>
              }
            />

            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              className="
          h-12
          flex-1
          rounded-full
        "
            >
              Có
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================================================== */}
      {/* SAVE DIALOG */}
      {/* ================================================== */}

      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent
          className="
      w-[calc(100%-32px)]
      max-w-md
      rounded-[32px]
      border-0
      bg-background
      p-6
      shadow-none
      sm:p-8
    "
        >
          <DialogHeader className="items-center gap-3 text-center">
            {/* ICON */}
            <div className="flex size-20 items-center justify-center">
              <HugeiconsIcon
                icon={SaveIcon}
                size={64}
                strokeWidth={1.5}
                className="text-primary-accent"
              />
            </div>

            <DialogTitle className="text-center text-2xl font-bold">
              Lưu thay đổi?
            </DialogTitle>

            <DialogDescription className="text-center text-base leading-6">
              Bạn có muốn lưu những thay đổi
              <br />
              cho ví này không?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-2 flex-row gap-3 sm:flex-row">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="
              h-12
              flex-1
              rounded-full
              border-0
              bg-muted
              text-text-primary
              hover:bg-muted/80
            "
                >
                  Không
                </Button>
              }
            />

            <Button
              type="button"
              onClick={handleConfirmSave}
              className="
          h-12
          flex-1
          rounded-full
          bg-primary-accent
        "
            >
              Có
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default WalletInformationPage;
