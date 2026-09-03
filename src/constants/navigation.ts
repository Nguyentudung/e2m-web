import {
  Home01Icon,
  Analytics01Icon,
  PlusSignIcon,
  Wallet01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

export const navigationItems = [
  {
    label: "Trang chính",
    path: "/",
    icon: Home01Icon,
    isPrimary: false,
  },
  {
    label: "Báo cáo",
    path: "/reports",
    icon: Analytics01Icon,
    isPrimary: false,
  },
  {
    label: "Ghi chú",
    path: "/add",
    icon: PlusSignIcon,
    isPrimary: true,
  },
  {
    label: "Ví",
    path: "/wallets",
    icon: Wallet01Icon,
    isPrimary: false,
  },
  {
    label: "Cá nhân",
    path: "/profile",
    icon: UserIcon,
    isPrimary: false,
  },
] as const;
