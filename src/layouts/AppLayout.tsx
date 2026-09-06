import { useState } from "react";
import { Outlet } from "react-router-dom";

import logo from "../assets/logo.png";

import { HugeiconsIcon } from "@hugeicons/react";
import { Menu11Icon } from "@hugeicons/core-free-icons";

import DesktopNav from "../components/layout/DesktopNav";
import BottomNav from "../components/layout/BottomNav";
import ExpandableSearch from "../components/layout/ExpandableSearch";
import RightDrawerMenu from "../components/layout/RightDrawerMenu";

import { NavigationProvider } from "../contexts/NavigationContext";

function AppLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);

  return (
    <NavigationProvider setBottomNavVisible={setIsBottomNavVisible}>
      <div className="relative min-h-screen overflow-x-hidden bg-background text-text-primary">
        {/* BACKGROUND IMAGE */}
        <div
          className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
          aria-hidden="true"
        />

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

        {/* MOBILE BOTTOM NAV */}
        {isBottomNavVisible && (
          <div className="relative z-30 md:hidden">
            <BottomNav />
          </div>
        )}

        {/* RIGHT DRAWER MENU */}
        <RightDrawerMenu
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      </div>
    </NavigationProvider>
  );
}

export default AppLayout;
