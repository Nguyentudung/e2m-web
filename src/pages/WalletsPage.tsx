import { useEffect, useState } from "react";

import { useNavigation } from "../contexts/NavigationContext";

import CreateWalletPage, {
  type CreateWalletDraft,
} from "@/components/wallet/CreateWalletPage";
import WalletInformationPage from "@/components/wallet/WalletInformationPage";
import BankSelectPage from "@/components/wallet/BankSelectPage";
import EwalletSelectPage from "@/components/wallet/EwalletSelectPage";
import CardSelectPage from "@/components/wallet/CardSelectPage";
import AssetTypeSelectPage from "@/components/wallet/AssetTypeSelectPage";
import CurrencySelectPage from "@/components/wallet/CurrencySelectPage";
import WalletsList from "@/components/wallet/WalletsList";

import {
  createWallet,
  deleteWallet,
  getWallets,
  saveWallet,
  updateWallet,
  type Wallet,
  type WalletType,
} from "@/types/wallets";

import { getExchangeRates } from "@/services/exchangeRate";
import type { ExchangeRates } from "@/types/exchangeRate";

type WalletPage =
  | "list"
  | "create"
  | "information"
  | "assetType"
  | "currency"
  | "bank"
  | "ewallet"
  | "card";

type AssetSelectionReturnPage = "create" | "information";

interface SelectedAsset {
  type: WalletType;
  id?: string;
  name?: string;
  icon?: string;
}

function WalletsPage() {
  // ==================================================
  // EXCHANGE RATES
  // ==================================================

  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    getExchangeRates()
      .then((rates) => {
        if (!cancelled) {
          setExchangeRates(rates);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setExchangeRates(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ==================================================
  // PAGE
  // ==================================================

  const [currentPage, setCurrentPage] = useState<WalletPage>("list");

  // ==================================================
  // WALLETS
  // ==================================================

  const [wallets, setWallets] = useState<Wallet[]>(getWallets);

  // ==================================================
  // SELECTED ASSET
  // ==================================================

  const [selectedAsset, setSelectedAsset] = useState<SelectedAsset | null>(
    null,
  );

  // ==================================================
  // CREATE WALLET DRAFT
  // ==================================================

  const emptyCreateDraft: CreateWalletDraft = {
    type: "cash",
    balance: "",
    currency: "VND",
    note: "",
    includeInTotal: true,
  };

  const [createDraft, setCreateDraft] = useState<CreateWalletDraft>(
    emptyCreateDraft,
  );

  const updateCreateDraft = (patch: Partial<CreateWalletDraft>) => {
    setCreateDraft((current) => ({ ...current, ...patch }));
  };

  // ==================================================
  // SELECTED WALLET
  // ==================================================

  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  // ==================================================
  // ASSET SELECTION RETURN PAGE
  // ==================================================

  const [assetSelectionReturnPage, setAssetSelectionReturnPage] =
    useState<AssetSelectionReturnPage>("create");

  // ==================================================
  // NAVIGATION
  // ==================================================

  const { setBottomNavVisible } = useNavigation();

  useEffect(() => {
    setBottomNavVisible(currentPage === "list");

    return () => {
      setBottomNavVisible(true);
    };
  }, [currentPage, setBottomNavVisible]);

  // ==================================================
  // CREATE WALLET
  // ==================================================

  const handleCreateWallet = () => {
    setSelectedWallet(null);
    setSelectedAsset(null);
    setCreateDraft(emptyCreateDraft);
    setCurrentPage("create");
  };

  // ==================================================
  // SELECT WALLET
  // ==================================================

  const handleSelectWallet = (wallet: Wallet) => {
    setSelectedWallet(wallet);

    setSelectedAsset({
      type: wallet.type,
      id: wallet.assetId,
    });

    setAssetSelectionReturnPage("information");
    setCurrentPage("information");
  };

  // ==================================================
  // BACK TO LIST
  // ==================================================

  const handleBackToList = () => {
    setSelectedWallet(null);
    setSelectedAsset(null);
    setCurrentPage("list");
  };

  // ==================================================
  // OPEN BANK SELECTOR FROM INFORMATION
  // ==================================================

  const handleInformationSelectBank = () => {
    setAssetSelectionReturnPage("information");
    setCurrentPage("bank");
  };

  // ==================================================
  // OPEN EWALLET SELECTOR FROM INFORMATION
  // ==================================================

  const handleInformationSelectEwallet = () => {
    setAssetSelectionReturnPage("information");
    setCurrentPage("ewallet");
  };

  // ==================================================
  // OPEN CARD SELECTOR FROM INFORMATION
  // ==================================================

  const handleInformationSelectCard = () => {
    setAssetSelectionReturnPage("information");
    setCurrentPage("card");
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* ================================================== */}
      {/* WALLET LIST */}
      {/* ================================================== */}

      <div
        className={`absolute inset-0 overflow-y-auto transition-transform duration-300 ease-out ${
          currentPage === "list" ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <WalletsList
          wallets={wallets}
          exchangeRates={exchangeRates}
          onCreateWallet={handleCreateWallet}
          onSelectWallet={handleSelectWallet}
        />
      </div>

      {/* ================================================== */}
      {/* CREATE WALLET */}
      {/* ================================================== */}

      <div
        className={`absolute inset-0 overflow-y-auto transition-transform duration-300 ease-out ${
          currentPage === "create"
            ? "translate-x-0"
            : currentPage === "list"
              ? "translate-x-full"
              : "-translate-x-full"
        }`}
      >
        <CreateWalletPage
          draft={createDraft}
          onChange={updateCreateDraft}
          onBack={handleBackToList}
          onSelectAssetType={() => setCurrentPage("assetType")}
          onSelectCurrency={() => setCurrentPage("currency")}
          onSave={(data) => {
            const newWallet = createWallet({
              type: data.type,
              assetId: data.assetId,
              balance: data.balance,
              currency: data.currency,
              note: data.note,
              includeInTotal: data.includeInTotal,
            });

            saveWallet(newWallet);

            setWallets((currentWallets) => [...currentWallets, newWallet]);

            setSelectedAsset(null);
            setCurrentPage("list");
          }}
        />
      </div>

      {/* ================================================== */}
      {/* WALLET INFORMATION */}
      {/* ================================================== */}

      <div
        className={`absolute inset-0 overflow-y-auto transition-transform duration-300 ease-out ${
          currentPage === "information"
            ? "translate-x-0"
            : currentPage === "list"
              ? "translate-x-full"
              : "-translate-x-full"
        }`}
      >
        {selectedWallet && (
          <WalletInformationPage
            wallet={selectedWallet}
            selectedAsset={selectedAsset}
            onBack={handleBackToList}
            onSelectBank={handleInformationSelectBank}
            onSelectEwallet={handleInformationSelectEwallet}
            onSelectCard={handleInformationSelectCard}
            onSave={(data) => {
              const updatedWallet: Wallet = {
                ...selectedWallet,
                ...data,
                updatedAt: new Date().toISOString(),
              };

              updateWallet(updatedWallet);

              setWallets((currentWallets) =>
                currentWallets.map((wallet) =>
                  wallet.id === updatedWallet.id ? updatedWallet : wallet,
                ),
              );

              setSelectedWallet(null);
              setSelectedAsset(null);
              setCurrentPage("list");
            }}
            onDelete={() => {
              deleteWallet(selectedWallet.id);

              setWallets((currentWallets) =>
                currentWallets.filter(
                  (wallet) => wallet.id !== selectedWallet.id,
                ),
              );

              setSelectedWallet(null);
              setSelectedAsset(null);
              setCurrentPage("list");
            }}
          />
        )}
      </div>

      {/* ================================================== */}
      {/* ASSET TYPE SELECT */}
      {/* ================================================== */}

      <div
        className={`absolute inset-0 overflow-y-auto transition-transform duration-300 ease-out ${
          currentPage === "assetType" ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <AssetTypeSelectPage
          selected={createDraft.type}
          onBack={() => setCurrentPage("create")}
          onSelect={(type) => {
            updateCreateDraft({
              type,
              assetId: undefined,
              assetName: undefined,
              assetIcon: undefined,
            });

            if (type === "bank") {
              setAssetSelectionReturnPage("create");
              setCurrentPage("bank");
            } else if (type === "ewallet") {
              setAssetSelectionReturnPage("create");
              setCurrentPage("ewallet");
            } else if (type === "card") {
              setAssetSelectionReturnPage("create");
              setCurrentPage("card");
            } else {
              setCurrentPage("create");
            }
          }}
        />
      </div>

      {/* ================================================== */}
      {/* CURRENCY SELECT */}
      {/* ================================================== */}

      <div
        className={`absolute inset-0 overflow-y-auto transition-transform duration-300 ease-out ${
          currentPage === "currency" ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <CurrencySelectPage
          selected={createDraft.currency}
          onBack={() => setCurrentPage("create")}
          onSelect={(code) => {
            updateCreateDraft({ currency: code });
            setCurrentPage("create");
          }}
        />
      </div>

      {/* ================================================== */}
      {/* BANK SELECT */}
      {/* ================================================== */}

      <div
        className={`absolute inset-0 overflow-y-auto transition-transform duration-300 ease-out ${
          currentPage === "bank" ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <BankSelectPage
          onBack={() => setCurrentPage(assetSelectionReturnPage)}
          onSelect={(bank) => {
            setSelectedAsset({
              type: "bank",
              id: bank.id,
              name: bank.name,
              icon: bank.icon,
            });

            if (assetSelectionReturnPage === "create") {
              updateCreateDraft({
                type: "bank",
                assetId: bank.id,
                assetName: bank.name,
                assetIcon: bank.icon,
              });
            }

            setCurrentPage(assetSelectionReturnPage);
          }}
        />
      </div>

      {/* ================================================== */}
      {/* EWALLET SELECT */}
      {/* ================================================== */}

      <div
        className={`absolute inset-0 overflow-y-auto transition-transform duration-300 ease-out ${
          currentPage === "ewallet" ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <EwalletSelectPage
          onBack={() => setCurrentPage(assetSelectionReturnPage)}
          onSelect={(ewallet) => {
            setSelectedAsset({
              type: "ewallet",
              id: ewallet.id,
              name: ewallet.name,
              icon: ewallet.icon,
            });

            if (assetSelectionReturnPage === "create") {
              updateCreateDraft({
                type: "ewallet",
                assetId: ewallet.id,
                assetName: ewallet.name,
                assetIcon: ewallet.icon,
              });
            }

            setCurrentPage(assetSelectionReturnPage);
          }}
        />
      </div>

      {/* ================================================== */}
      {/* CARD SELECT */}
      {/* ================================================== */}

      <div
        className={`absolute inset-0 overflow-y-auto transition-transform duration-300 ease-out ${
          currentPage === "card" ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <CardSelectPage
          onBack={() => setCurrentPage(assetSelectionReturnPage)}
          onSelect={(card) => {
            setSelectedAsset({
              type: "card",
              id: card.id,
              name: card.name,
              icon: card.icon,
            });

            if (assetSelectionReturnPage === "create") {
              updateCreateDraft({
                type: "card",
                assetId: card.id,
                assetName: card.name,
                assetIcon: card.icon,
              });
            }

            setCurrentPage(assetSelectionReturnPage);
          }}
        />
      </div>
    </div>
  );
}

export default WalletsPage;
