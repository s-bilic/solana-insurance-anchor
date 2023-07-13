import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaLamportTransfer } from "../target/types/solana_lamport_transfer";

import {
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { assert } from "chai";
describe("Test transfers", () => {
  it("transferLamports", async () => {
    // Generate keypair for the new account
    const newAccountKp = new anchor.web3.Keypair();
    // Send transaction
    const data = new anchor.BN(1000000);
    const txHash = await pg.program.methods
      .transferLamports(data)
      .accounts({
        from: pg.wallet.publicKey,
        to: newAccountKp.publicKey,
      })
      .signers([pg.wallet.keypair])
      .rpc();
    console.log(`https://explorer.solana.com/tx/${txHash}?cluster=devnet`);
    await pg.connection.confirmTransaction(txHash, "finalized");
    const newAccountBalance = await pg.program.provider.connection.getBalance(
      newAccountKp.publicKey
    );
    assert.strictEqual(
      newAccountBalance,
      data.toNumber(),
      "The new account should have the transferred lamports"
    );
  });
});