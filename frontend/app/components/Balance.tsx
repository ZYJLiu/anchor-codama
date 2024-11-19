import { address } from "@solana/web3.js";
import type { UiWalletAccount } from "@wallet-standard/react";
import { useContext, useMemo } from "react";
import useSWRSubscription from "swr/subscription";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChainContext } from "../context/ChainContext";
import { RpcContext } from "../context/RpcContext";
import { balanceSubscribe } from "../functions/balance";
import { AlertTriangle } from "lucide-react";

type Props = Readonly<{
  account: UiWalletAccount;
}>;

const seenErrors = new WeakSet();

export function Balance({ account }: Props) {
  const { chain } = useContext(ChainContext);
  const { rpc, rpcSubscriptions } = useContext(RpcContext);
  const subscribe = useMemo(
    () => balanceSubscribe.bind(null, rpc, rpcSubscriptions),
    [rpc, rpcSubscriptions]
  );
  const { data: lamports, error } = useSWRSubscription(
    { address: address(account.address), chain },
    subscribe
  );

  if (error && !seenErrors.has(error)) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AlertTriangle
              className="inline-block h-4 w-4 text-destructive"
              style={{ verticalAlign: "text-bottom" }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Failed to fetch balance</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else if (lamports == null) {
    return <span className="text-muted-foreground">&ndash;</span>;
  } else {
    const formattedSolValue = new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 5,
    }).format(
      // @ts-expect-error This format string is 100% allowed now.
      `${lamports}E-9`
    );
    return <span>{`${formattedSolValue} \u25CE`}</span>;
  }
}
