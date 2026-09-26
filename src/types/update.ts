export interface PlatformUpdateInfo {
  version: string | null;
  build: number | null;
  download_url: string | null;
  available: boolean;
  release_notes: string[];
}

export interface UpdateInfo {
  android: PlatformUpdateInfo;
  ios: PlatformUpdateInfo;
}
