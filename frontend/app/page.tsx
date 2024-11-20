"use client";

import { CounterProgram } from "./components/CounterProgram";
import { Balance } from "./components/Balance";
import { useContext, Suspense } from "react";
import { ChainContext } from "./context/ChainContext";
import { SelectedWalletAccountContext } from "./context/SelectedWalletAccountContext";
import { ErrorBoundary } from "react-error-boundary";
import { WalletAccountIcon } from "./components/WalletAccountIcon";

export default function Home() {
  const { chain } = useContext(ChainContext);
  const [selectedWalletAccount] = useContext(SelectedWalletAccountContext);

  return (
    <div className="flex items-center justify-center min-h-[50vh] p-8">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        {selectedWalletAccount ? (
          <div className="flex flex-col gap-6">
            <div className="flex gap-2">
              <div className="flex items-center gap-3 flex-grow">
                <WalletAccountIcon
                  account={selectedWalletAccount}
                  height="48"
                  width="48"
                  alt=""
                />
                <div>
                  <h4 className="text-[15px] font-medium leading-[20px]">
                    {selectedWalletAccount.label ?? "Account Address"}
                  </h4>
                  {selectedWalletAccount.address}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <h4 className="text-[15px] font-medium leading-[20px]">
                  Balance
                </h4>
                <ErrorBoundary
                  fallback={<span>&ndash;</span>}
                  key={`${selectedWalletAccount.address}:${chain}`}
                >
                  <Suspense fallback={<span className="animate-spin">⋯</span>}>
                    <Balance account={selectedWalletAccount} />
                  </Suspense>
                </ErrorBoundary>
              </div>
            </div>
            <CounterProgram account={selectedWalletAccount} />
          </div>
        ) : (
          <p className="font-bold">
            Click &quot;Connect Wallet&quot; to get started.
          </p>
        )}
      </main>
    </div>
  );
}
