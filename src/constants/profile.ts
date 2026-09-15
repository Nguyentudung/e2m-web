// Shared profile constants for AvatarEditModal and related components
export const AVATAR_BG_PRESETS = [
  { id: "sky", class: "from-[#E0F2FE] to-[#BAE6FD]", label: "Xanh mây" },
  { id: "sunset", class: "from-[#FED7AA] to-[#FBCFE8]", label: "Hoàng hôn" },
  { id: "pink", class: "from-[#FCE7F3] to-[#F472B6]", label: "Hồng kẹo" },
  { id: "cyan", class: "from-[#CFFAFE] to-[#38BDF8]", label: "Xanh ngọc" },
  { id: "lavender", class: "from-[#DDD6FE] to-[#C084FC]", label: "Tím oải hương" },
  { id: "mint", class: "from-[#DCFCE7] to-[#4ADE80]", label: "Xanh bạc hà" },
  { id: "yellow", class: "from-[#FEF08A] to-[#FACC15]", label: "Vàng chanh" },
  { id: "coral", class: "from-[#FFEDD5] to-[#FB923C]", label: "Cam san hô" },
];

export const AVATAR_EMOJIS = [
  "😟", "😃", "🤬", "🤯", "😜",
  "😋", "🥵", "🥶", "🙄", "😇",
  "😍", "😲", "😴", "🥳", "🤖",
  "🚀", "�猫", "🦊", "💎", "⚡",
];

export const AVATAR_ANIMATIONS = [
  { id: "float", label: "🚀 Nổi lơ lửng" },
  { id: "pulse", label: "💖 Nhịp đập" },
  { id: "bounce", label: "⚡ Nhún nảy" },
  { id: "spin", label: "🌀 Xoay nhẹ" },
  { id: "none", label: "⏸️ Tĩnh" },
] as const;
