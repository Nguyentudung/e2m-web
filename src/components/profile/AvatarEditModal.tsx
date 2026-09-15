import { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  DiceFaces01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

interface AvatarEditModalProps {
  open: boolean;
  currentBg?: string;
  currentIcon?: string;
  currentAnimation?: "none" | "bounce" | "pulse" | "spin" | "float";
  onClose: () => void;
  onSave: (bg: string, icon: string, animation: "none" | "bounce" | "pulse" | "spin" | "float") => void;
}

import { AVATAR_BG_PRESETS, AVATAR_EMOJIS, AVATAR_ANIMATIONS } from '@/constants/profile';

export default function AvatarEditModal({
  open,
  currentBg = "from-[#E0F2FE] to-[#BAE6FD]",
  currentIcon = "😟",
  currentAnimation = "float",
  onClose,
  onSave,
}: AvatarEditModalProps) {
  const [selectedBg, setSelectedBg] = useState(currentBg);
  const [selectedIcon, setSelectedIcon] = useState(currentIcon);
  const [selectedAnim, setSelectedAnim] = useState<"none" | "bounce" | "pulse" | "spin" | "float">(currentAnimation);

  if (!open) return null;

  // Randomize background, icon, and animation
  const handleRandomize = () => {
    const randomBg = AVATAR_BG_PRESETS[Math.floor(Math.random() * AVATAR_BG_PRESETS.length)].class;
    const randomIcon = AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)];
    const randomAnim = AVATAR_ANIMATIONS[Math.floor(Math.random() * AVATAR_ANIMATIONS.length)].id;

    setSelectedBg(randomBg);
    setSelectedIcon(randomIcon);
    setSelectedAnim(randomAnim);
  };

  const handleSave = () => {
    onSave(selectedBg, selectedIcon, selectedAnim);
  };

  // Motion variants for dynamic animated avatar icon
  const getAnimationProps = () => {
    switch (selectedAnim) {
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

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* iOS Modal Sheet */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-t-[28px] sm:rounded-[26px] bg-surface p-6 shadow-2xl text-text-primary border border-border/80">
        {/* Mobile drag handle */}
        <div className="sm:hidden -mt-2 mb-3 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-text-tertiary/30" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3.5 mb-5">
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1D2129] text-white">
              <HugeiconsIcon icon={UserIcon} size={13} strokeWidth={2} />
            </div>
            <h2 className="text-base font-bold text-text-primary">
              Chỉnh sửa ảnh đại diện
            </h2>
          </div>

          <div className="w-8" />
        </div>

        {/* Scrollable Body */}
        <div className="max-h-[68vh] overflow-y-auto pr-1 space-y-6">
          {/* Live Preview Avatar */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div
              className={`flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-tr ${selectedBg} shadow-md transition-all duration-300`}
            >
              <motion.span
                key={`${selectedIcon}-${selectedAnim}`}
                {...getAnimationProps()}
                className="text-5xl select-none"
              >
                {selectedIcon}
              </motion.span>
            </div>

            {/* Randomize Button */}
            <Button
              type="button"
              onClick={handleRandomize}
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5 bg-primary-100/60 dark:bg-primary-500/20 border-primary-300/50 text-primary-500 font-semibold px-4 py-1.5"
            >
              <HugeiconsIcon icon={DiceFaces01Icon} size={16} strokeWidth={2} />
              <span>Ngẫu nhiên</span>
            </Button>
          </div>

          {/* Background Gradient Palette Grid */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-text-tertiary">
              Nền đại diện
            </p>

            <div className="grid grid-cols-4 gap-2.5">
              {AVATAR_BG_PRESETS.map((bg) => {
                const isSelected = selectedBg === bg.class;

                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setSelectedBg(bg.class)}
                    className={`group relative flex h-11 w-full items-center justify-center rounded-2xl bg-gradient-to-tr ${bg.class} transition-all ${
                      isSelected
                        ? "ring-2 ring-primary-500 ring-offset-2 ring-offset-surface scale-[1.05]"
                        : "hover:scale-[1.02]"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Emoji Selection Grid */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-text-tertiary">
              Biểu tượng cảm xúc
            </p>

            <div className="grid grid-cols-5 gap-2.5">
              {AVATAR_EMOJIS.map((emoji) => {
                const isSelected = selectedIcon === emoji;

                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedIcon(emoji)}
                    className={`flex h-12 w-full items-center justify-center rounded-full bg-background border transition-all ${
                      isSelected
                        ? "border-primary-500 ring-2 ring-primary-500/30 scale-110 bg-primary-100/30 dark:bg-primary-500/20"
                        : "border-border/60 hover:bg-surface-secondary"
                    }`}
                  >
                    <span className="text-2xl select-none">{emoji}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Animation Selector */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-text-tertiary">
              Hiệu ứng động (Dynamic Animation)
            </p>

            <div className="flex flex-wrap gap-2">
              {AVATAR_ANIMATIONS.map((anim) => {
                const isSelected = selectedAnim === anim.id;

                return (
                  <button
                    key={anim.id}
                    type="button"
                    onClick={() => setSelectedAnim(anim.id)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-primary-500 text-white shadow-xs"
                        : "bg-surface-secondary text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {anim.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Save Button */}
        <div className="mt-6 pt-2">
          <Button
            onClick={handleSave}
            className="w-full rounded-full bg-[#1D2129] dark:bg-white text-white dark:text-black hover:bg-[#1D2129]/90 dark:hover:bg-white/90 py-3.5 text-sm font-semibold shadow-md"
          >
            Lưu
          </Button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') as HTMLElement
  );
}
