import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import logo from "../assets/logo.jpg";

import { HugeiconsIcon } from "@hugeicons/react";
import { Menu11Icon } from "@hugeicons/core-free-icons";

import DesktopNav from "../components/layout/DesktopNav";
import BottomNav from "../components/layout/BottomNav";
import ExpandableSearch from "../components/layout/ExpandableSearch";
import RightDrawerMenu from "../components/layout/RightDrawerMenu";

import { NavigationProvider } from "../contexts/NavigationContext";
import { Toaster } from "@/components/ui/toast";
import { SecurityProvider } from "@/security/SecurityContext";
import { useSecurity } from "@/security/useSecurity";
import { LockScreen } from "@/security/LockScreen";

const ROOT_PATHS = ["/home", "/reports", "/wallets", "/profile"];

function AppSecurityShell() {
  const { isReady, isLocked } = useSecurity();
  if (!isReady) return null;

  return (
    <>
      <AppLayout />
      {isLocked && <LockScreen />}
    </>
  );
}

function AppLayout() {
  const { pathname } = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);

  const isRootPage = ROOT_PATHS.includes(pathname);
  const shouldShowBottomNav = isRootPage && isBottomNavVisible;

  return (
    <NavigationProvider setBottomNavVisible={setIsBottomNavVisible}>
      <div className="relative min-h-screen overflow-x-hidden bg-background text-text-primary">
        {/* DESKTOP HEADER */}
        <header className="relative z-20 hidden h-16 bg-background/95 md:block">
          <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center px-6">
            {/* LOGO */}
            <div className="flex items-center gap-2 text-2xl font-bold">
              <img
                src={logo}
                alt="Montra"
                className="h-10 w-auto logo-light-image"
              />
              Montra
            </div>

            {/* CENTER NAV */}
            <DesktopNav />

            {/* RIGHT ACTIONS */}
            <div className="flex items-center justify-end gap-2">
              <ExpandableSearch />

              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-full
                  text-text-secondary
                  transition-colors
                  hover:bg-surface
                  hover:text-text-primary
                "
                aria-label="Mở menu"
              >
                <HugeiconsIcon icon={Menu11Icon} size={21} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="relative z-10">
          <Outlet />
        </main>

        {/* MOBILE BOTTOM NAV – trượt lên/xuống mượt */}
        <AnimatePresence>
          {shouldShowBottomNav && (
            <motion.div
              key="bottom-nav"
              className="fixed inset-x-0 bottom-0 z-30 md:hidden"
              initial={{ y: 140, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 140, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <BottomNav />
            </motion.div>
          )}
        </AnimatePresence>

        {/* RIGHT DRAWER MENU */}
        <RightDrawerMenu
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
        <Toaster />
      </div>
    </NavigationProvider>
  );
}

export default function ProtectedAppLayout() {
  return (
    <SecurityProvider>
      <AppSecurityShell />
    </SecurityProvider>
  );
}
