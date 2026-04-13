import { createContext, useContext } from 'react';

/** Trigger the upgrade modal from anywhere in the dashboard. */
const UpgradeContext = createContext<(() => void) | undefined>(undefined);

export const UpgradeProvider = UpgradeContext.Provider;

export function useUpgrade(): () => void {
  const open = useContext(UpgradeContext);
  if (open === undefined) {
    throw new Error('useUpgrade must be used within an UpgradeProvider');
  }
  return open;
}
