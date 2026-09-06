import { createContext, useContext } from "react";

interface NavigationContextValue {
  setBottomNavVisible: (visible: boolean) => void;
}

const NavigationContext = createContext<
  NavigationContextValue | undefined
>(undefined);

export function NavigationProvider({
  children,
  setBottomNavVisible,
}: {
  children: React.ReactNode;
  setBottomNavVisible: (visible: boolean) => void;
}) {
  return (
    <NavigationContext.Provider value={{ setBottomNavVisible }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error(
      "useNavigation must be used inside NavigationProvider",
    );
  }

  return context;
}