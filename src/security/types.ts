export interface SecuritySettings {
  version: 1;
  enabled: boolean;
  biometricEnabled: boolean;
  credentialId?: string;
  pinSalt: string;
  pinHash: string;
}

export type SecuritySettingsWithoutSecret = Omit<
  SecuritySettings,
  "pinSalt" | "pinHash"
>;
