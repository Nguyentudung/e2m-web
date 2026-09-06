export type WalletType = "cash" | "bank" | "ewallet" | "card";

export interface Wallet {
  id: string;
  type: WalletType;

  assetId?: string;
  assetName?: string;
  assetIcon?: string;

  balance: number;
  currency: string;
  note: string;

  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "montra-wallets";

export function getWallets(): Wallet[] {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function saveWallet(wallet: Wallet): void {
  const wallets = getWallets();

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...wallets, wallet]));
}

export function createWallet(
  data: Omit<Wallet, "id" | "createdAt" | "updatedAt">,
): Wallet {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateWallet(updatedWallet: Wallet): void {
  const wallets = getWallets();

  const updatedWallets = wallets.map((wallet) =>
    wallet.id === updatedWallet.id ? updatedWallet : wallet,
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWallets));
}

export function deleteWallet(walletId: string): void {
  const wallets = getWallets();

  const updatedWallets = wallets.filter((wallet) => wallet.id !== walletId);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWallets));
}
