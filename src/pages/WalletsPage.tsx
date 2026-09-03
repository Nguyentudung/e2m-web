import { useState } from "react";

import wallet from "../assets/icons/wallet.svg";
import { Button } from "@/components/ui/button";

import CreateWalletPage from "@/components/wallet/CreateWalletPage";
import BankSelectPage from "@/components/wallet/BankSelectPage";
import EwalletSelectPage from "@/components/wallet/EwalletSelectPage";
import CardSelectPage from "@/components/wallet/CardSelectPage";

type WalletPage = "list" | "create" | "bank" | "ewallet" | "card";

interface SelectedAsset {
  type: "cash" | "bank" | "ewallet" | "card";
  id?: string;
  name?: string;
  icon?: string;
}

function WalletsPage() {
  const [currentPage, setCurrentPage] = useState<WalletPage>("list");

  const [selectedAsset, setSelectedAsset] = useState<SelectedAsset | null>(
    null,
  );

  const handleCreateWallet = () => {
    setSelectedAsset(null);
    setCurrentPage("create");
  };

  const handleBackToList = () => {
    setSelectedAsset(null);
    setCurrentPage("list");
  };

  const handleSelectBank = () => {
    setCurrentPage("bank");
  };

  const handleSelectEwallet = () => {
    setCurrentPage("ewallet");
  };

  const handleSelectCard = () => {
    setCurrentPage("card");
  };

  return (
    <div className="relative min-h-[75vh] overflow-hidden">
      {/* ================================================== */}
      {/* WALLET LIST */}
      {/* ================================================== */}

      <div
        className={`absolute inset-0 transition-transform duration-300 ease-out ${
          currentPage === "list" ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <section className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
          <img
            src={wallet}
            alt="Ví tiền"
            className="mb-4 h-80 w-80 object-contain"
          />

          <h1 className="mb-6 text-xl font-bold text-text-primary">
            Chưa có ví hoặc thẻ nào
          </h1>

          <Button onClick={handleCreateWallet} size="lg">
            + Tạo ví mới ngay
          </Button>
        </section>
      </div>

      {/* ================================================== */}
      {/* CREATE WALLET */}
      {/* ================================================== */}

      <div
        className={`absolute inset-0 transition-transform duration-300 ease-out ${
          currentPage === "create"
            ? "translate-x-0"
            : currentPage === "list"
              ? "translate-x-full"
              : "-translate-x-full"
        }`}
      >
        <CreateWalletPage
          selectedAsset={selectedAsset}
          onBack={handleBackToList}
          onSelectBank={handleSelectBank}
          onSelectEwallet={handleSelectEwallet}
          onSelectCard={handleSelectCard}
          onSave={(data) => {
            console.log("Wallet data:", data);

            // Sau này lưu LocalStorage / Supabase ở đây.

            setCurrentPage("list");
          }}
        />
      </div>

      {/* ================================================== */}
      {/* BANK SELECT */}
      {/* ================================================== */}

      <div
        className={`absolute inset-0 transition-transform duration-300 ease-out ${
          currentPage === "bank" ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <BankSelectPage
          onBack={() => setCurrentPage("create")}
          onSelect={(bank) => {
            setSelectedAsset({
              type: "bank",
              id: bank.id,
              name: bank.name,
              icon: bank.icon,
            });

            setCurrentPage("create");
          }}
        />
      </div>

      {/* ================================================== */}
      {/* EWALLET SELECT */}
      {/* ================================================== */}

      <div
        className={`absolute inset-0 transition-transform duration-300 ease-out ${
          currentPage === "ewallet" ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <EwalletSelectPage
          onBack={() => setCurrentPage("create")}
          onSelect={(ewallet) => {
            setSelectedAsset({
              type: "ewallet",
              id: ewallet.id,
              name: ewallet.name,
              icon: ewallet.icon,
            });

            setCurrentPage("create");
          }}
        />
      </div>

      {/* ================================================== */}
      {/* CARD SELECT */}
      {/* ================================================== */}

      <div
        className={`absolute inset-0 transition-transform duration-300 ease-out ${
          currentPage === "card" ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <CardSelectPage
          onBack={() => setCurrentPage("create")}
          onSelect={(card) => {
            setSelectedAsset({
              type: "card",
              id: card.id,
              name: card.name,
              icon: card.icon,
            });

            setCurrentPage("create");
          }}
        />
      </div>
    </div>
  );
}

export default WalletsPage;
