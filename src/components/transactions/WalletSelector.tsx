import { HugeiconsIcon } from "@hugeicons/react";
import { Wallet01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { getAssetIcon } from "@/utils/assetIcons";
import { banks } from "@/data/banks";
import { ewallets } from "@/data/ewallets";
import type { Wallet } from "@/types/wallets";
import { formatCurrency } from "@/utils/currency";
import walletPlaceholder from "@/assets/icons/wallet.svg";

interface WalletSelectorProps {
  open: boolean;
  onClose: () => void;
  wallets: Wallet[];
  selectedWalletId: string;
  onSelect: (walletId: string) => void;
}

function getAssetName(wallet: Wallet): string {
  if (wallet.type === "cash") return "Tien mat";
  if (wallet.assetId) {
    const bank = banks.find((b) => b.id === wallet.assetId);
    if (bank) return bank.name;
    const ew = ewallets.find((e) => e.id === wallet.assetId);
    if (ew) return ew.name;
  }
  return wallet.assetId ?? "Vi";
}

function getAssetIconSrc(wallet: Wallet): string | undefined {
  if (!wallet.assetId) return undefined;
  if (wallet.type === "bank") {
    const bank = banks.find((b) => b.id === wallet.assetId);
    return bank ? getAssetIcon("bank", bank.icon) : undefined;
  }
  if (wallet.type === "ewallet") {
    const ew = ewallets.find((e) => e.id === wallet.assetId);
    return ew ? getAssetIcon("ewallet", ew.icon) : undefined;
  }
  return undefined;
}

export default function WalletSelector({
  open,
  onClose,
  wallets,
  selectedWalletId,
  onSelect,
}: WalletSelectorProps) {
  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="bg-surface">
        <DrawerHeader>
          <DrawerTitle className="text-text-primary">Chon vi</DrawerTitle>
        </DrawerHeader>

        <div className="space-y-2 px-4 pb-8">
          {wallets.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <HugeiconsIcon icon={Wallet01Icon} size={48} strokeWidth={1.5} className="text-text-tertiary" />
              <p className="text-sm text-text-secondary">
                Ban chua co vi nao.<br />
                Vui long tao vi truoc.
              </p>
            </div>
          ) : (
            wallets.map((wallet) => {
              const isSelected = wallet.id === selectedWalletId;
              const name = getAssetName(wallet);
              const iconSrc = getAssetIconSrc(wallet);

              return (
                <button
                  key={wallet.id}
                  type="button"
                  onClick={() => { onSelect(wallet.id); onClose(); }}
                  className={`
                    flex w-full items-center gap-3 rounded-2xl px-4 py-3
                    transition-colors duration-150
                    ${isSelected
                      ? "bg-primary-100 dark:bg-primary-500/20"
                      : "bg-surface-secondary hover:bg-border/30 active:bg-border/50"
                    }
                  `}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface">
                    {iconSrc ? (
                      <img src={iconSrc} alt={name} className="size-7 object-contain" />
                    ) : (
                      <img src={walletPlaceholder} alt="Vi" className="size-7 object-contain opacity-60" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 text-left">
                    <p className={`truncate text-sm font-semibold ${isSelected ? "text-primary-500" : "text-text-primary"}`}>
                      {name}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {formatCurrency(wallet.balance, wallet.currency)}
                    </p>
                  </div>

                  {isSelected && (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} strokeWidth={2} className="text-primary-500" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
