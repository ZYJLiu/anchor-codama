"use client";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./ThemeToggle";
import { useContext } from "react";

import { ChainContext } from "../context/ChainContext";
import { ConnectWalletMenu } from "./ConnectWalletMenu";

export function Nav() {
  const {
    displayName: currentChainName,
    chain,
    setChain,
  } = useContext(ChainContext);

  const currentChainBadge = (
    <Badge variant="secondary" className="align-middle">
      {currentChainName}
    </Badge>
  );

  return (
    <div className="sticky top-0 z-10 border-b bg-background p-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-grow">
          <h1 className="truncate text-2xl font-bold sm:text-3xl">
            {setChain ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <span>{currentChainBadge}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup
                    value={chain}
                    onValueChange={(value: string) => {
                      setChain(value as `solana:${string}`);
                    }}
                  >
                    {process.env.REACT_EXAMPLE_APP_ENABLE_MAINNET === "true" ? (
                      <DropdownMenuRadioItem value="solana:mainnet">
                        Mainnet Beta
                      </DropdownMenuRadioItem>
                    ) : null}
                    <DropdownMenuRadioItem value="solana:devnet">
                      Devnet
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="solana:testnet">
                      Testnet
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              currentChainBadge
            )}
          </h1>
        </div>
        <ConnectWalletMenu>Connect Wallet</ConnectWalletMenu>
        <ModeToggle />
      </div>
    </div>
  );
}
