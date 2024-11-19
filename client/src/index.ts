import {
  airdropFactory,
  appendTransactionMessageInstructions,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  lamports,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from "@solana/web3.js";
import {
  getInitializeInstruction,
  getIncrementInstruction,
  fetchCounter,
} from "../codama-sdks/js/src/generated";

// Create Connection, localhost in this example
const rpc = createSolanaRpc("http://127.0.0.1:8899");
const rpcSubscriptions = createSolanaRpcSubscriptions("ws://127.0.0.1:8900");

// Generate keypairs for fee payer and counter account
const feePayer = await generateKeyPairSigner();
const counter = await generateKeyPairSigner();

// Fund fee payer
await airdropFactory({ rpc, rpcSubscriptions })({
  recipientAddress: feePayer.address,
  lamports: lamports(1_000_000_000n),
  commitment: "confirmed",
});

// Log SOL balance of fee payer
const balance = await rpc.getBalance(feePayer.address).send();
console.log(balance);

const createInstruction = getInitializeInstruction({
  payer: feePayer,
  counter,
});

const incrementInstruction = getIncrementInstruction({
  counter: counter.address,
});

// Order of instructions to add to transaction
const instructions = [createInstruction, incrementInstruction];

// Get latest blockhash to include in transaction
const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

// Create transaction message
const transactionMessage = pipe(
  createTransactionMessage({ version: 0 }), // Create transaction message
  (tx) => setTransactionMessageFeePayerSigner(feePayer, tx), // Set fee payer
  (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx), // Set transaction blockhash
  (tx) => appendTransactionMessageInstructions(instructions, tx) // Append instructions
);

// Sign transaction message with required signers (fee payer and mint keypair)
const signedTransaction =
  await signTransactionMessageWithSigners(transactionMessage);

// Send and confirm transaction
await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
  signedTransaction,
  { commitment: "confirmed" }
);

// Get transaction signature
const transactionSignature = getSignatureFromTransaction(signedTransaction);
console.log("Transaction Signature:", transactionSignature);

// Fetch counter account
const counterAccount = await fetchCounter(rpc, counter.address);
console.log(counterAccount);
