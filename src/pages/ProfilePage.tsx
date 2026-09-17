import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  PencilEdit02Icon,
  Sun01Icon,
  Moon01Icon,
  HelpCircleIcon,
  FolderSecurityIcon,
  InformationCircleIcon,
  ArrowRight01Icon,
  ShieldCheckIcon,
  GiftIcon,
  QrCodeIcon,
} from "@hugeicons/core-free-icons";

import { Switch } from "@/components/ui/switch";
import ProfileEditModal from "@/components/profile/ProfileEditModal";
import AvatarEditModal from "@/components/profile/AvatarEditModal";
import UserGuideModal from "@/components/profile/UserGuideModal";
import DataBackupModal from "@/components/profile/DataBackupModal";
import { getUserProfile, saveUserProfile } from "../utils/userStorage";
import { SecurityDialog } from "@/security/SecurityDialog";
import { useSecurity } from "@/security/useSecurity";

function ProfilePage() {
  const [profileData, setProfileData] = useState(() => getUserProfile());
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const { settings } = useSecurity();

  // Sync theme status on mount & change
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleThemeToggle = (checked: boolean) => {
    setIsDark(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Save updated nickname
  const handleSaveNickname = (nickname: string) => {
    const updatedProfile = {
      ...profileData,
      nickname,
    };
    saveUserProfile(updatedProfile);
    setProfileData(updatedProfile);
    setIsEditingName(false);
  };

  // Save updated avatar (bg, icon, animation)
  const handleSaveAvatar = (
    avatarBg: string,
    avatarIcon: string,
    avatarAnimation: "none" | "bounce" | "pulse" | "spin" | "float"
  ) => {
    const updatedProfile = {
      ...profileData,
      avatarBg,
      avatarIcon,
      avatarAnimation,
    };
    saveUserProfile(updatedProfile);
    setProfileData(updatedProfile);
    setIsEditingAvatar(false);
  };

  const hasNickname = profileData.nickname.trim() !== "";
  const displayName = hasNickname ? profileData.nickname : "ntd";
  const userHandle = displayName;

  // Dynamic animation helper for avatar icon
  const getAnimationProps = () => {
    switch (profileData.avatarAnimation) {
      case "float":
        return {
          animate: { y: [0, -6, 0] },
          transition: { repeat: Infinity, duration: 2.4, ease: "easeInOut" as const },
        };
      case "pulse":
        return {
          animate: { scale: [1, 1.12, 1] },
          transition: { repeat: Infinity, duration: 1.8, ease: "easeInOut" as const },
        };
      case "bounce":
        return {
          animate: { y: [0, -10, 0] },
          transition: { repeat: Infinity, duration: 0.8, ease: "easeOut" as const },
        };
      case "spin":
        return {
          animate: { rotate: [0, 15, -15, 0] },
          transition: { repeat: Infinity, duration: 3, ease: "easeInOut" as const },
        };
      default:
        return {};
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-5 pb-28 text-text-primary space-y-6">
      {/* ================================================== */}
      {/* PAGE TITLE HEADER */}
      {/* ================================================== */}
      <div className="flex items-center justify-between pt-1 pb-2">
        <h1 className="w-full text-center text-lg font-bold text-text-primary">
          Hồ sơ cá nhân
        </h1>
      </div>

      {/* ================================================== */}
      {/* 1. CENTERED AVATAR & USER IDENTIFIER */}
      {/* ================================================== */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="relative">
          {/* Customizable Avatar Background Circle */}
          <div
            onClick={() => setIsEditingAvatar(true)}
            className={`cursor-pointer flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr ${
              profileData.avatarBg || "from-[#E0F2FE] to-[#BAE6FD]"
            } shadow-sm transition-transform hover:scale-[1.03] active:scale-[0.98]`}
          >
            {/* Dynamic Animated Avatar Icon/Emoji */}
            <motion.span
              key={`${profileData.avatarIcon}-${profileData.avatarAnimation}`}
              {...getAnimationProps()}
              className="text-4xl select-none"
            >
              {profileData.avatarIcon || "😟"}
            </motion.span>
          </div>

          {/* Edit Avatar Badge Overlay */}
          <button
            type="button"
            onClick={() => setIsEditingAvatar(true)}
            aria-label="Chỉnh sửa ảnh đại diện"
            className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-background border border-border shadow-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            <HugeiconsIcon icon={PencilEdit02Icon} size={14} strokeWidth={2} />
          </button>
        </div>

        {/* User Handle & Edit Icon */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-text-primary">
            {userHandle}
          </span>
          <button
            type="button"
            onClick={() => setIsEditingName(true)}
            aria-label="Chỉnh sửa tên người dùng"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors"
          >
            <HugeiconsIcon icon={PencilEdit02Icon} size={14} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* ================================================== */}
      {/* 2. FEATURED QUICK CARDS (2 COLUMNS) */}
      {/* ================================================== */}
      <div className="grid grid-cols-2 gap-3">
        {/* Verification Card */}
        <div className="flex flex-col justify-between rounded-[22px] bg-surface p-4 transition-transform active:scale-[0.98]">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#22C55E]/15 text-[#22C55E] mb-3">
            <HugeiconsIcon icon={ShieldCheckIcon} size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary leading-tight">
              Tôi là người thật
            </p>
            <p className="text-[11px] text-text-secondary mt-1 leading-snug">
              Đã xác minh bằng Quét khuôn mặt
            </p>
          </div>
        </div>

        {/* Referral Card */}
        <div className="flex flex-col justify-between rounded-[22px] bg-surface p-4 transition-transform active:scale-[0.98]">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3B82F6]/15 text-[#3B82F6] mb-3">
            <HugeiconsIcon icon={GiftIcon} size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary leading-tight">
              Giới thiệu
            </p>
            <p className="text-[11px] text-text-secondary mt-1 leading-snug">
              Mời bạn bè và nhận phần thưởng
            </p>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 3. EXTENSION UTILITIES (Tiện ích mở rộng) */}
      {/* ================================================== */}
      <div className="space-y-2">
        <h2 className="px-1 text-xs font-semibold text-text-tertiary">
          Tiện ích mở rộng
        </h2>

        <div className="flex items-center justify-between rounded-[22px] bg-surface p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-tr from-[#6366F1] to-[#A855F7] text-white shadow-xs">
              <HugeiconsIcon icon={QrCodeIcon} size={22} strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">
                Thanh toán QR
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                Chạm để thanh toán
              </p>
            </div>
          </div>

          <button
            type="button"
            className="rounded-full bg-surface-secondary px-4 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-secondary/80 transition-colors"
          >
            Mở
          </button>
        </div>
      </div>

      {/* ================================================== */}
      {/* 4. PERSONAL PROFILE & SETTINGS (Hồ sơ cá nhân) */}
      {/* ================================================== */}
      <div className="space-y-2">
        <h2 className="px-1 text-xs font-semibold text-text-tertiary">
          Hồ sơ cá nhân & Cài đặt
        </h2>

        <div className="rounded-[22px] bg-surface overflow-hidden divide-y divide-border/50">
          {/* Username Edit Item */}
          <button
            type="button"
            onClick={() => setIsEditingName(true)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-surface-secondary/40 transition-colors active:bg-surface-secondary/60"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1D2129] dark:bg-white/15 text-white">
                <HugeiconsIcon icon={UserIcon} size={18} strokeWidth={2} />
              </div>
              <span className="text-sm font-semibold text-text-primary">
                Tài khoản ({userHandle})
              </span>
            </div>

            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={18}
              strokeWidth={2}
              className="text-text-tertiary"
            />
          </button>

          {/* Avatar Edit Item */}
          <button
            type="button"
            onClick={() => setIsEditingAvatar(true)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-surface-secondary/40 transition-colors active:bg-surface-secondary/60"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1D2129] dark:bg-white/15 text-white">
                <HugeiconsIcon icon={PencilEdit02Icon} size={18} strokeWidth={2} />
              </div>
              <span className="text-sm font-semibold text-text-primary">
                Đổi ảnh đại diện & Hiệu ứng động
              </span>
            </div>

            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={18}
              strokeWidth={2}
              className="text-text-tertiary"
            />
          </button>

          {/* Theme Toggle item */}
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1D2129] dark:bg-white/15 text-white">
                <HugeiconsIcon
                  icon={isDark ? Moon01Icon : Sun01Icon}
                  size={18}
                  strokeWidth={2}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  Chế độ tối (Dark Mode)
                </p>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  {isDark ? "Giao diện tối đang bật" : "Giao diện sáng đang bật"}
                </p>
              </div>
            </div>

            <Switch
              checked={isDark}
              onCheckedChange={handleThemeToggle}
              aria-label="Chuyển đổi giao diện sáng tối"
            />
          </div>

          {/* Data Backup item */}
          <button
            type="button"
            onClick={() => setIsSecurityOpen(true)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-surface-secondary/40 transition-colors active:bg-surface-secondary/60"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1D2129] dark:bg-white/15 text-white">
                <HugeiconsIcon icon={ShieldCheckIcon} size={18} strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Khóa bảo mật</p>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  {settings?.enabled ? "Đã bật" : "Chưa thiết lập"}
                </p>
              </div>
            </div>

            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={18}
              strokeWidth={2}
              className="text-text-tertiary"
            />
          </button>

          {/* Data Backup item */}
          <button
            type="button"
            onClick={() => setIsBackupOpen(true)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-surface-secondary/40 transition-colors active:bg-surface-secondary/60"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1D2129] dark:bg-white/15 text-white">
                <HugeiconsIcon icon={FolderSecurityIcon} size={18} strokeWidth={2} />
              </div>
              <span className="text-sm font-semibold text-text-primary">
                Quản lý & Sao lưu dữ liệu
              </span>
            </div>

            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={18}
              strokeWidth={2}
              className="text-text-tertiary"
            />
          </button>
        </div>
      </div>

      {/* ================================================== */}
      {/* 5. RESOURCES & HELP (Tài nguyên) */}
      {/* ================================================== */}
      <div className="space-y-2">
        <h2 className="px-1 text-xs font-semibold text-text-tertiary">
          Tài nguyên
        </h2>

        <div className="rounded-[22px] bg-surface overflow-hidden divide-y divide-border/50">
          {/* User guide item */}
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-surface-secondary/40 transition-colors active:bg-surface-secondary/60"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1D2129] dark:bg-white/15 text-white">
                <HugeiconsIcon icon={HelpCircleIcon} size={18} strokeWidth={2} />
              </div>
              <span className="text-sm font-semibold text-text-primary">
                Trung tâm trợ giúp & Hướng dẫn
              </span>
            </div>

            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={18}
              strokeWidth={2}
              className="text-text-tertiary"
            />
          </button>

          {/* App info item */}
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1D2129] dark:bg-white/15 text-white">
                <HugeiconsIcon icon={InformationCircleIcon} size={18} strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  Montra Finance
                </p>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  Phiên bản v1.0.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <ProfileEditModal
        open={isEditingName}
        nickname={profileData.nickname}
        onClose={() => setIsEditingName(false)}
        onSave={handleSaveNickname}
      />

      <AvatarEditModal
        open={isEditingAvatar}
        currentBg={profileData.avatarBg}
        currentIcon={profileData.avatarIcon}
        currentAnimation={profileData.avatarAnimation}
        onClose={() => setIsEditingAvatar(false)}
        onSave={handleSaveAvatar}
      />

      <SecurityDialog key={isSecurityOpen ? "open" : "closed"} open={isSecurityOpen} onOpenChange={setIsSecurityOpen} />

      <UserGuideModal
        open={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <DataBackupModal
        open={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />
    </div>
  );
}

export default ProfilePage;
