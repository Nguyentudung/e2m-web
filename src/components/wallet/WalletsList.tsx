import { HugeiconsIcon } from "@hugeicons/react";
import { PlusIcon, ViewIcon } from "@hugeicons/core-free-icons";

import wallet from "@/assets/icons/wallet.svg";
import logo from "@/assets/logo.png"; // <-- Import logo của bạn
import { Button } from "@/components/ui/button";

import { banks } from "@/data/banks";
import { ewallets } from "@/data/ewallets";
import { getAssetIcon } from "@/utils/assetIcons";
import { formatCurrency } from "@/utils/currency";

import type { Wallet } from "@/types/wallets";
import type { ExchangeRates } from "@/types/exchangeRate";
import { convertToVnd } from "@/utils/exchangeRate";

interface WalletsListProps {
  wallets: Wallet[];
  exchangeRates: ExchangeRates | null;
  onCreateWallet: () => void;
  onSelectWallet: (wallet: Wallet) => void;
}

function WalletsList({
  wallets,
  exchangeRates,
  onCreateWallet,
  onSelectWallet,
}: WalletsListProps) {
  /* ================================================== */
  /* TOTAL ASSETS */
  /* ================================================== */

  const totalBalance =
    exchangeRates === null
      ? null
      : wallets.reduce((total, item) => {
          if (item.includeInTotal === false) {
            return total;
          }
          try {
            return (
              total + convertToVnd(item.balance, item.currency, exchangeRates)
            );
          } catch {
            return total;
          }
        }, 0);

  const displayCurrency = "VND";

  /* ================================================== */
  /* GET ASSET METADATA */
  /* ================================================== */

  const getAssetMetadata = (item: Wallet) => {
    if (!item.assetId) {
      return null;
    }

    if (item.type === "bank") {
      return banks.find((asset) => asset.id === item.assetId);
    }

    if (item.type === "ewallet") {
      return ewallets.find((asset) => asset.id === item.assetId);
    }

    return null;
  };

  /* ================================================== */
  /* WALLET TYPE LABEL */
  /* ================================================== */

  const getWalletTypeLabel = (type: Wallet["type"]) => {
    switch (type) {
      case "cash":
        return "Tiền mặt";
      case "bank":
        return "Ngân hàng";
      case "ewallet":
        return "Ví điện tử";
      case "card":
        return "Thẻ";
      default:
        return "Tài sản";
    }
  };

  return (
    <section className="min-h-screen bg-background">
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <header className="flex h-20 items-center justify-between px-4">
        <Button variant="ghost" size="icon" className="size-11 rounded-full">
          <HugeiconsIcon
            icon={ViewIcon}
            size={22}
            strokeWidth={2}
            className="size-6"
          />
        </Button>

        <h1 className="text-xl font-bold text-text-primary">Tài khoản</h1>

        <Button
          variant="ghost"
          size="icon"
          onClick={onCreateWallet}
          className="size-11 rounded-full"
        >
          <HugeiconsIcon
            icon={PlusIcon}
            size={22}
            strokeWidth={2}
            className="size-6"
          />
        </Button>
      </header>

      <div className="px-4 pb-32">
        {/* ================================================== */}
        {/* TOTAL ASSETS CARD */}
        {/* ================================================== */}

        <section className="wallet-total-card relative mb-8 overflow-hidden rounded-[28px] p-6">
          {/* Logo in ở góc dưới bên phải */}
          <img
            src={logo}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-5 -right-5 size-36 origin-bottom-right rotate-[12deg] object-contain opacity-[var(--wallet-logo-opacity)] dark:mix-blend-screen"
          />

          {/* Nội dung chữ */}
          <div className="relative z-10">
            <p className="mb-2 text-sm font-medium text-text-secondary">
              Tài sản ròng
            </p>

            <p className="mb-8 text-3xl font-bold tracking-tight text-text-primary">
              {totalBalance === null
                ? "Đang cập nhật..."
                : formatCurrency(totalBalance, displayCurrency)}
            </p>

            <div>
              <p className="mb-1 text-sm font-medium text-text-secondary">
                Tài sản
              </p>

              <p className="text-lg font-semibold text-text-primary">
                {totalBalance === null
                  ? "Đang cập nhật..."
                  : formatCurrency(totalBalance, displayCurrency)}
              </p>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* WALLET LIST */}
        {/* ================================================== */}

        <div>
          {/* SECTION HEADER */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">
              Ví của tôi
            </h2>

            {wallets.length > 0 && (
              <button
                type="button"
                onClick={onCreateWallet}
                className="text-sm font-medium text-text-secondary transition hover:text-text-primary"
              >
                + Thêm ví
              </button>
            )}
          </div>

          {/* EMPTY STATE */}
          {wallets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <img
                src={wallet}
                alt="Ví tiền"
                className="mb-4 h-48 w-48 object-contain"
              />

              <p className="mb-5 text-base text-text-secondary">
                Bạn chưa có ví nào
              </p>

              <Button onClick={onCreateWallet} className="rounded-full">
                + Tạo ví mới
              </Button>
            </div>
          ) : (
            /* WALLET CARDS */
            <div className="space-y-3">
              {wallets.map((item) => {
                const asset = getAssetMetadata(item);
                const assetIcon = getAssetIcon(item.type, asset?.icon);
                const assetName =
                  asset?.name ??
                  (item.type === "cash"
                    ? "Tiền mặt"
                    : (item.assetId ?? "Tài sản"));

                const assetType = getWalletTypeLabel(item.type);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectWallet(item)}
                    className="w-full overflow-hidden rounded-2xl bg-surface p-4 text-left transition active:scale-[0.99]"
                  >
                    {/* LỚP 1 — LOẠI TÀI SẢN */}
                    <div className="flex h-7 items-center px-1">
                      <span className="text-sm font-medium text-primary-accent">
                        {assetType}
                      </span>
                    </div>

                    {/* LỚP 2 — NỘI DUNG */}
                    <div className="mt-2 rounded-xl bg-background px-3 pb-4 pt-4">
                      {/* LỚP 3 — ASSET CARD */}
                      <div className="rounded-xl bg-surface px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* ICON */}
                          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface">
                            {assetIcon ? (
                              <img
                                src={assetIcon}
                                alt={assetName}
                                className="size-8 object-contain"
                              />
                            ) : (
                              <img
                                src={wallet}
                                alt="Tiền mặt"
                                className="size-8 object-contain"
                              />
                            )}
                          </div>

                          {/* NAME + NOTE */}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-base font-semibold text-text-primary">
                              {assetName}
                            </p>

                            {item.note && (
                              <p className="mt-0.5 truncate text-sm text-text-secondary">
                                {item.note}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* TOTAL VALUE */}
                      <div className="flex items-center justify-between px-1 pt-3">
                        <p className="text-sm text-text-secondary">
                          Tổng giá trị
                        </p>

                        <p className="text-sm font-semibold text-text-primary">
                          {formatCurrency(item.balance, item.currency)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default WalletsList;
