import { createContext } from "react";

import { getSecuritySettings } from "./security";

export interface SecurityContextValue {
  isReady: boolean;
  isLocked: boolean;
  settings: ReturnType<typeof getSecuritySettings>;
  lock: () => void;
  unlockWithPin: (pin: string) => Promise<boolean>;
  unlockWithBiometric: () => Promise<boolean>;
  refresh: () => void;
}

export const SecurityContext = createContext<SecurityContextValue | null>(null);
