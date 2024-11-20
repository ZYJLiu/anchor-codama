import { Button } from "@/components/ui/button";
import { useWalletAccountTransactionSendingSigner } from "@solana/react";
import {
  Address,
  appendTransactionMessageInstruction,
  assertIsTransactionMessageWithSingleSendingSigner,
  createTransactionMessage,
  generateKeyPairSigner,
  getBase58Decoder,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
  Signature,
  SignatureBytes,
} from "@solana/web3.js";
import { createRecentSignatureConfirmationPromiseFactory } from "@solana/transaction-confirmation";
import { type UiWalletAccount } from "@wallet-standard/react";
import { useContext, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ErrorDialog } from "./ErrorDialog";
import { ChainContext } from "../context/ChainContext";
import { RpcContext } from "../context/RpcContext";
import {
  getInitializeInstruction,
  getIncrementInstruction,
  fetchCounter,
} from "../../codama-sdks/src/generated";
import { install } from "@solana/webcrypto-ed25519-polyfill";
install();

type Props = Readonly<{
  account: UiWalletAccount;
}>;

export function CounterProgram({ account }: Props) {
  const { toast } = useToast();
  const { current: NO_ERROR } = useRef(Symbol());
  const { rpc, rpcSubscriptions } = useContext(RpcContext);
  const [isSendingTransaction, setIsSendingTransaction] = useState(false);
  const [error, setError] = useState<unknown>(NO_ERROR);
  const [counterAddress, setCounterAddress] = useState<Address | undefined>();
  const [counterValue, setCounterValue] = useState<number | undefined>();
  const { chain: currentChain, solanaExplorerClusterName } =
    useContext(ChainContext);
  const transactionSendingSigner = useWalletAccountTransactionSendingSigner(
    account,
    currentChain
  );

  // Send transaction to create a new counter
  const handleCreateCounter = async (): Promise<SignatureBytes> => {
    setError(NO_ERROR);
    setIsSendingTransaction(true);
    try {
      const { value: latestBlockhash } = await rpc
        .getLatestBlockhash({ commitment: "confirmed" })
        .send();

      const newCounter = await generateKeyPairSigner();
      const message = pipe(
        createTransactionMessage({ version: 0 }),
        (m) => setTransactionMessageFeePayerSigner(transactionSendingSigner, m),
        (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
        (m) =>
          appendTransactionMessageInstruction(
            getInitializeInstruction({
              payer: transactionSendingSigner,
              counter: newCounter,
            }),
            m
          )
      );

      assertIsTransactionMessageWithSingleSendingSigner(message);
      const signature = await signAndSendTransactionMessageWithSigners(message);

      const getRecentSignatureConfirmationPromise =
        createRecentSignatureConfirmationPromiseFactory({
          rpc,
          rpcSubscriptions,
        });

      await getRecentSignatureConfirmationPromise({
        abortSignal: new AbortController().signal,
        commitment: "confirmed",
        signature: getBase58Decoder().decode(signature) as Signature,
      });

      setCounterAddress(newCounter.address);
      const counterAccount = await fetchCounter(rpc, newCounter.address);
      setCounterValue(Number(counterAccount.data.count));

      return signature;
    } catch (e) {
      console.error(e);
      setError(e);
      throw e;
    } finally {
      setIsSendingTransaction(false);
    }
  };

  // Send transaction to increment the counter
  const handleIncrementCounter = async (): Promise<SignatureBytes> => {
    setError(NO_ERROR);
    setIsSendingTransaction(true);
    try {
      const { value: latestBlockhash } = await rpc
        .getLatestBlockhash({ commitment: "confirmed" })
        .send();

      const message = pipe(
        createTransactionMessage({ version: 0 }),
        (m) => setTransactionMessageFeePayerSigner(transactionSendingSigner, m),
        (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
        (m) =>
          appendTransactionMessageInstruction(
            getIncrementInstruction({
              counter: counterAddress!,
            }),
            m
          )
      );

      assertIsTransactionMessageWithSingleSendingSigner(message);
      const signature = await signAndSendTransactionMessageWithSigners(message);

      const getRecentSignatureConfirmationPromise =
        createRecentSignatureConfirmationPromiseFactory({
          rpc,
          rpcSubscriptions,
        });

      await getRecentSignatureConfirmationPromise({
        abortSignal: new AbortController().signal,
        commitment: "confirmed",
        signature: getBase58Decoder().decode(signature) as Signature,
      });

      const counterAccount = await fetchCounter(rpc, counterAddress!);
      setCounterValue(Number(counterAccount.data.count));

      return signature;
    } catch (e) {
      console.error(e);
      setError(e);
      throw e;
    } finally {
      setIsSendingTransaction(false);
    }
  };

  const handleButtonClick = async (e: React.FormEvent) => {
    e.preventDefault();

    const signature = !counterAddress
      ? await handleCreateCounter()
      : await handleIncrementCounter();

    const decodedSignature = getBase58Decoder().decode(signature);
    toast({
      title: "Transaction Confirmed",
      description: (
        <div className="flex flex-col gap-2">
          <a
            href={`https://explorer.solana.com/tx/${decodedSignature}?cluster=${solanaExplorerClusterName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm break-all text-primary hover:underline"
          >
            View on Explorer: {decodedSignature}
          </a>
        </div>
      ),
    });
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        {counterAddress && (
          <div className="text-center">
            <p>Counter Address: {counterAddress.toString()}</p>
            <p className="text-2xl font-bold">Count: {counterValue ?? "..."}</p>
          </div>
        )}

        <Button
          onClick={handleButtonClick}
          disabled={isSendingTransaction}
          className={`w-[150px] mx-auto ${
            isSendingTransaction ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSendingTransaction ? (
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-spin"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </div>
          ) : counterAddress ? (
            "Increment Counter"
          ) : (
            "Create Counter"
          )}
        </Button>

        {error !== NO_ERROR ? (
          <ErrorDialog
            error={error}
            onClose={() => setError(NO_ERROR)}
            title="Transaction failed"
          />
        ) : null}
      </div>
    </div>
  );
}
