"use client";

import { AlertTriangle } from "lucide-react";
import { StandardConnect, StandardDisconnect } from "@wallet-standard/core";
import type { UiWallet } from "@wallet-standard/react";
import {
  uiWalletAccountBelongsToUiWallet,
  useWallets,
} from "@wallet-standard/react";
import { useContext, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { SelectedWalletAccountContext } from "../context/SelectedWalletAccountContext";
import { ConnectWalletMenuItem } from "./ConnectWalletMenuItem";
import { UnconnectableWalletMenuItem } from "./UnconnectableWalletMenuItem";
import { ErrorDialog } from "./ErrorDialog";
import { WalletAccountIcon } from "./WalletAccountIcon";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export function ConnectWalletMenu({ children }: Props) {
  const { current: NO_ERROR } = useRef(Symbol());
  const wallets = useWallets();
  const [selectedWalletAccount, setSelectedWalletAccount] = useContext(
    SelectedWalletAccountContext
  );
  const [error, setError] = useState(NO_ERROR);
  const [forceClose, setForceClose] = useState(false);

  function renderItem(wallet: UiWallet) {
    return (
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <UnconnectableWalletMenuItem error={error} wallet={wallet} />
        )}
        key={`wallet:${wallet.name}`}
      >
        <ConnectWalletMenuItem
          onAccountSelect={(account) => {
            setSelectedWalletAccount(account);
            setForceClose(true);
          }}
          onDisconnect={(wallet) => {
            if (
              selectedWalletAccount &&
              uiWalletAccountBelongsToUiWallet(selectedWalletAccount, wallet)
            ) {
              setSelectedWalletAccount(undefined);
            }
          }}
          onError={setError}
          wallet={wallet}
        />
      </ErrorBoundary>
    );
  }

  const walletsThatSupportStandardConnect = [];
  const unconnectableWallets = [];

  for (const wallet of wallets) {
    if (
      wallet.features.includes(StandardConnect) &&
      wallet.features.includes(StandardDisconnect)
    ) {
      walletsThatSupportStandardConnect.push(wallet);
    } else {
      unconnectableWallets.push(wallet);
    }
  }

  return (
    <>
      <DropdownMenu
        open={forceClose ? false : undefined}
        onOpenChange={() => setForceClose(false)}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {selectedWalletAccount ? (
              <>
                <WalletAccountIcon
                  account={selectedWalletAccount}
                  width="18"
                  height="18"
                  alt=""
                />
                <span className="ml-2">
                  {selectedWalletAccount.address.slice(0, 8)}
                </span>
              </>
            ) : (
              children
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          {wallets.length === 0 ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This browser has no wallets installed.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {walletsThatSupportStandardConnect.map(renderItem)}
              {unconnectableWallets.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  {unconnectableWallets.map(renderItem)}
                </>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {error !== NO_ERROR ? (
        <ErrorDialog error={error} onClose={() => setError(NO_ERROR)} />
      ) : null}
    </>
  );
}
