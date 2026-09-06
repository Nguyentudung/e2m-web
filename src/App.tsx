import { useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";

import HomePage from "./pages/HomePage";
import ReportsPage from "./pages/ReportsPage";
import AddTransactionPage from "./pages/AddTransactionPage";
import WalletsPage from "./pages/WalletsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

import CreateWalletPage, {
  type SelectedAsset,
} from "./components/wallet/CreateWalletPage";
import BankSelectPage from "./components/wallet/BankSelectPage";
import EwalletSelectPage from "./components/wallet/EwalletSelectPage";
import CardSelectPage from "./components/wallet/CardSelectPage";

function AppRoutes() {
  const navigate = useNavigate();

  // ============================================================
  // WALLET FLOW STATE
  // ============================================================

  const [selectedAsset, setSelectedAsset] = useState<SelectedAsset | null>(
    null,
  );

  // ============================================================
  // WALLET FLOW HANDLERS
  // ============================================================

  const handleBackToWallets = () => {
    setSelectedAsset(null);
    navigate("/wallets");
  };

  const handleSelectBank = () => {
    navigate("/wallets/create/bank");
  };

  const handleSelectEwallet = () => {
    navigate("/wallets/create/ewallet");
  };

  const handleSelectCard = () => {
    navigate("/wallets/create/card");
  };

  const handleBankSelect = (bank: {
    id: string;
    name: string;
    icon: string;
  }) => {
    setSelectedAsset({
      type: "bank",
      id: bank.id,
      name: bank.name,
      icon: bank.icon,
    });

    navigate("/wallets/create");
  };

  const handleEwalletSelect = (ewallet: {
    id: string;
    name: string;
    icon: string;
  }) => {
    setSelectedAsset({
      type: "ewallet",
      id: ewallet.id,
      name: ewallet.name,
      icon: ewallet.icon,
    });

    navigate("/wallets/create");
  };

  const handleCardSelect = (card: {
    id: string;
    name: string;
    icon: string;
  }) => {
    setSelectedAsset({
      type: "card",
      id: card.id,
      name: card.name,
      icon: card.icon,
    });

    navigate("/wallets/create");
  };

  const handleSaveWallet = (data: {
    type: "cash" | "bank" | "ewallet" | "card";
    assetId?: string;
    balance: number;
    currency: string;
    note: string;
  }) => {
    // TODO:
    // Thêm logic lưu ví vào database / localStorage ở đây.
    console.log("Create wallet:", data);

    setSelectedAsset(null);
    navigate("/wallets");
  };

  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* ================================================== */}
        {/* TRANG CHÍNH */}
        {/* ================================================== */}

        <Route path="/" element={<HomePage />} />

        <Route path="/reports" element={<ReportsPage />} />

        <Route path="/add" element={<AddTransactionPage />} />

        <Route path="/wallets" element={<WalletsPage />} />

        <Route path="/profile" element={<ProfilePage />} />

        {/* ================================================== */}
        {/* WALLET FLOW */}
        {/* ================================================== */}

        <Route
          path="/wallets/create"
          element={
            <CreateWalletPage
              selectedAsset={selectedAsset}
              onBack={handleBackToWallets}
              onSelectBank={handleSelectBank}
              onSelectEwallet={handleSelectEwallet}
              onSelectCard={handleSelectCard}
              onSave={handleSaveWallet}
            />
          }
        />

        <Route
          path="/wallets/create/bank"
          element={
            <BankSelectPage
              onBack={() => navigate("/wallets/create")}
              onSelect={handleBankSelect}
            />
          }
        />

        <Route
          path="/wallets/create/ewallet"
          element={
            <EwalletSelectPage
              onBack={() => navigate("/wallets/create")}
              onSelect={handleEwalletSelect}
            />
          }
        />

        <Route
          path="/wallets/create/card"
          element={
            <CardSelectPage
              onBack={() => navigate("/wallets/create")}
              onSelect={handleCardSelect}
            />
          }
        />

        {/* ================================================== */}
        {/* 404 */}
        {/* ================================================== */}

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
