import type { UserProfile } from "../types/user";

const STORAGE_KEY = "montra_user_profile";

export function getUserProfile(): UserProfile {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return {
      nickname: "",
    };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return {
      nickname: "",
    };
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
