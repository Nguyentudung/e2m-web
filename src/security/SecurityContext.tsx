import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { getAutoLockTimeout, getSecuritySettings } from "./security";
import { verifyBiometric } from "./biometric";
import { verifyPin } from "./pin";
import { SecurityContext } from "./context";

export function SecurityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(() => getSecuritySettings());
  const [isReady] = useState(true);
  const [isLocked, setIsLocked] = useState(() => Boolean(getSecuritySettings()?.enabled));
  const lastActivity = useRef(0);

  const refresh = useCallback(() => {
    const next = getSecuritySettings();
    setSettings(next);
    if (!next?.enabled) {
      setIsLocked(false);
    }
  }, []);

  const lock = useCallback(() => {
    if (getSecuritySettings()?.enabled) {
      setIsLocked(true);
    }
  }, []);

  const unlockWithPin = useCallback(async (pin: string) => {
    const current = getSecuritySettings();
    if (!current || !(await verifyPin(pin, current))) {
      return false;
    }
    setIsLocked(false);
    lastActivity.current = Date.now();
    return true;
  }, []);

  const unlockWithBiometric = useCallback(async () => {
    const current = getSecuritySettings();
    if (!current?.biometricEnabled || !current.credentialId) {
      return false;
    }
    const success = await verifyBiometric(current.credentialId);
    if (success) {
      setIsLocked(false);
      lastActivity.current = Date.now();
    }
    return success;
  }, []);

  useEffect(() => {
    lastActivity.current = Date.now();
    const markActivity = () => {
      lastActivity.current = Date.now();
    };
    const checkInactivity = () => {
      if (
        getSecuritySettings()?.enabled &&
        !isLocked &&
        Date.now() - lastActivity.current >= getAutoLockTimeout()
      ) {
        setIsLocked(true);
      }
    };
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        lastActivity.current = Date.now() - getAutoLockTimeout();
      } else {
        checkInactivity();
      }
    };

    window.addEventListener("pointerdown", markActivity);
    window.addEventListener("keydown", markActivity);
    window.addEventListener("touchstart", markActivity);
    document.addEventListener("visibilitychange", handleVisibility);
    const interval = window.setInterval(checkInactivity, 15_000);
    return () => {
      window.removeEventListener("pointerdown", markActivity);
      window.removeEventListener("keydown", markActivity);
      window.removeEventListener("touchstart", markActivity);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.clearInterval(interval);
    };
  }, [isLocked]);

  const value = useMemo(
    () => ({ isReady, isLocked, settings, lock, unlockWithPin, unlockWithBiometric, refresh }),
    [isReady, isLocked, settings, lock, unlockWithPin, unlockWithBiometric, refresh],
  );

  return <SecurityContext.Provider value={value}>{children}</SecurityContext.Provider>;
}
