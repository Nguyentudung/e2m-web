import type { SecuritySettings, SecuritySettingsWithoutSecret } from "./types";

const STORAGE_KEY = "montra_security_v1";
const EMPTY_SETTINGS: SecuritySettingsWithoutSecret = {
  version: 1,
  enabled: false,
  biometricEnabled: false,
};

export function getSecuritySettings(): SecuritySettings | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<SecuritySettings>;
    if (
      parsed.version !== 1 ||
      typeof parsed.enabled !== "boolean" ||
      typeof parsed.biometricEnabled !== "boolean" ||
      typeof parsed.pinSalt !== "string" ||
      typeof parsed.pinHash !== "string"
    ) {
      return null;
    }
    return parsed as SecuritySettings;
  } catch {
    return null;
  }
}

export function saveSecuritySettings(settings: SecuritySettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function clearSecuritySettings() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getSecurityStatus(): SecuritySettingsWithoutSecret {
  const settings = getSecuritySettings();
  if (!settings) {
    return EMPTY_SETTINGS;
  }
  return {
    version: settings.version,
    enabled: settings.enabled,
    biometricEnabled: settings.biometricEnabled,
    credentialId: settings.credentialId,
  };
}

export const AUTO_LOCK_TIMEOUT = 5 * 60 * 1000;
export const DEFAULT_AUTO_LOCK_MINUTES = 5;

export function getAutoLockTimeout(settings: SecuritySettings | null = getSecuritySettings()) {
  return (settings?.autoLockMinutes ?? DEFAULT_AUTO_LOCK_MINUTES) * 60 * 1000;
}
