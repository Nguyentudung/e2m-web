/**
 * Compares two semantic versions (MAJOR.MINOR.PATCH)
 * @param currentVersion The current version (e.g. "1.0.0")
 * @param latestVersion The latest version (e.g. "1.1.0")
 * @returns 1 if latest > current, -1 if latest < current, 0 if equal
 */
export function compareVersions(currentVersion: string, latestVersion: string): number {
  const currentParts = currentVersion.replace(/^v/, '').split('.').map(Number);
  const latestParts = latestVersion.replace(/^v/, '').split('.').map(Number);

  for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
    const current = currentParts[i] || 0;
    const latest = latestParts[i] || 0;

    if (latest > current) return 1;
    if (latest < current) return -1;
  }

  return 0;
}
