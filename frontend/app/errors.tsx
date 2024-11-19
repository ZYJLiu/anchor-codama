import {
  isWalletStandardError,
  WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_CHAIN_UNSUPPORTED,
  WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_FEATURE_UNIMPLEMENTED,
  WALLET_STANDARD_ERROR__FEATURES__WALLET_FEATURE_UNIMPLEMENTED,
} from "@wallet-standard/core";
import React from "react";

export const NO_ERROR = Symbol();

const InlineCode = ({ children }: { children: React.ReactNode }) => (
  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
    {children}
  </code>
);

export function getErrorMessage(
  err: unknown,
  fallbackMessage: React.ReactNode
): React.ReactNode {
  if (
    isWalletStandardError(
      err,
      WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_FEATURE_UNIMPLEMENTED
    )
  ) {
    return (
      <>
        This account does not support the{" "}
        <InlineCode>{err.context.featureName}</InlineCode> feature
      </>
    );
  } else if (
    isWalletStandardError(
      err,
      WALLET_STANDARD_ERROR__FEATURES__WALLET_FEATURE_UNIMPLEMENTED
    )
  ) {
    return (
      <div className="flex flex-col gap-4">
        <p>
          The wallet '{err.context.walletName}' (
          {err.context.supportedChains.sort().map((chain, ii, { length }) => (
            <React.Fragment key={chain}>
              <InlineCode>{chain}</InlineCode>
              {ii === length - 1 ? null : ", "}
            </React.Fragment>
          ))}
          ) does not support the{" "}
          <InlineCode>{err.context.featureName}</InlineCode> feature.
        </p>
        <div>
          <p>Features supported:</p>
          <ul className="mt-2 list-disc pl-6">
            {err.context.supportedFeatures.sort().map((featureName) => (
              <li key={featureName}>
                <InlineCode>{featureName}</InlineCode>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  } else if (
    isWalletStandardError(
      err,
      WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_CHAIN_UNSUPPORTED
    )
  ) {
    return (
      <div className="flex flex-col gap-4">
        <p>
          This account does not support the chain{" "}
          <InlineCode>{err.context.chain}</InlineCode>.
        </p>
        <div>
          <p>Chains supported:</p>
          <ul className="mt-2 list-disc pl-6">
            {err.context.supportedChains.sort().map((chain) => (
              <li key={chain}>
                <InlineCode>{chain}</InlineCode>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  } else if (err && typeof err === "object" && "message" in err) {
    return String(err.message);
  }
  return fallbackMessage;
}
