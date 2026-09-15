export interface UserProfile {
  nickname: string;
  avatarIcon?: string;
  avatarBg?: string;
  avatarAnimation?: "none" | "bounce" | "pulse" | "spin" | "float";
}
