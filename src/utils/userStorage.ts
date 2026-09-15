import type { UserProfile } from "../types/user";

const STORAGE_KEY = "montra_user_profile";

export const DEFAULT_USER_PROFILE: UserProfile = {
  nickname: "ntd",
  avatarIcon: "😟",
  avatarBg: "from-[#E0F2FE] to-[#BAE6FD]",
  avatarAnimation: "float",
};

export function getUserProfile(): UserProfile {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return DEFAULT_USER_PROFILE;
  }

  try {
    const parsed = JSON.parse(stored);
    return {
      ...DEFAULT_USER_PROFILE,
      ...parsed,
    };
  } catch {
    return DEFAULT_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
