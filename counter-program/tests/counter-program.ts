import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CounterProgram } from "../target/types/counter_program";
import { Keypair } from "@solana/web3.js";

describe("counter-program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.CounterProgram as Program<CounterProgram>;
  // Generate a new keypair to use as the address the counter account
  const counterAccount = new Keypair();
  it("Is initialized!", async () => {
    // Invoke the initialize instruction
    const transactionSignature = await program.methods
      .initialize()
      .accounts({
        counter: counterAccount.publicKey,
      })
      .signers([counterAccount]) // include counter keypair as additional signer
      .rpc({ skipPreflight: true });

    // Fetch the counter account data
    const accountData = await program.account.counter.fetch(
      counterAccount.publicKey
    );

    console.log(`Transaction Signature: ${transactionSignature}`);
    console.log(`Count: ${accountData.count}`);
  });

  it("Increment", async () => {
    // Invoke the increment instruction
    const transactionSignature = await program.methods
      .increment()
      .accounts({
        counter: counterAccount.publicKey,
      })
      .rpc();

    // Fetch the counter account data
    const accountData = await program.account.counter.fetch(
      counterAccount.publicKey
    );

    console.log(`Transaction Signature: ${transactionSignature}`);
    console.log(`Count: ${accountData.count}`);
  });
});
