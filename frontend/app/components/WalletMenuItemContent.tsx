import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import type { UiWallet } from "@wallet-standard/react";
import React from "react";
import { cn } from "@/lib/utils";

type Props = Readonly<{
  children?: React.ReactNode;
  loading?: boolean;
  wallet: UiWallet;
}>;

export function WalletMenuItemContent({ children, loading, wallet }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin absolute inset-0 m-auto" />
        )}
        <Avatar className={cn("h-[18px] w-[18px]", loading && "opacity-50")}>
          <AvatarImage src={wallet.icon} alt={wallet.name} />
          <AvatarFallback className="text-xs">
            {wallet.name.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
      </div>
      <span className="truncate">{children ?? wallet.name}</span>
    </div>
  );
}
