import type { UiWalletAccount } from "@wallet-standard/react";
import {
  uiWalletAccountBelongsToUiWallet,
  useWallets,
} from "@wallet-standard/react";
import Image from "next/image";
import React from "react";

type Props = Omit<React.ComponentProps<typeof Image>, "src"> &
  Readonly<{
    account: UiWalletAccount;
  }>;

export function WalletAccountIcon({ account, ...imageProps }: Props) {
  const wallets = useWallets();
  let icon;
  if (account.icon) {
    icon = account.icon;
  } else {
    for (const wallet of wallets) {
      if (uiWalletAccountBelongsToUiWallet(account, wallet)) {
        icon = wallet.icon;
        break;
      }
    }
  }
  return icon ? <Image src={icon} {...imageProps} alt="" /> : null;
}
