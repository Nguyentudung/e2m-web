import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";

import HomePage from "./pages/HomePage";
import ReportsPage from "./pages/ReportsPage";
import AddTransactionPage from "./pages/AddTransactionPage";
import WalletsPage from "./pages/WalletsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import SelectCategoryPage from "./pages/SelectCategoryPage";
import SelectWalletPage from "./pages/SelectWalletPage";
import CalendarPage from "./pages/CalendarPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* ================================================== */}
        {/* ROOT PAGES – CÓ BOTTOM NAVIGATION                  */}
        {/* ================================================== */}

        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/wallets" element={<WalletsPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* ================================================== */}
        {/* DEEP PAGES – KHÔNG CÓ BOTTOM NAVIGATION            */}
        {/* ================================================== */}

        <Route path="/add" element={<AddTransactionPage />} />
        <Route path="/add/category" element={<SelectCategoryPage />} />
        <Route path="/add/wallet" element={<SelectWalletPage />} />
        <Route path="/calendar" element={<CalendarPage />} />

        {/* ================================================== */}
        {/* 404                                                */}
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
