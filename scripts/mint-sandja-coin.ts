import {
  BlockfrostProvider,
  MeshWallet,
  Transaction,
  ForgeScript,
} from "@meshsdk/core";
import type { Mint, AssetMetadata } from "@meshsdk/core";

const BLOCKFROST_KEY = process.env.BLOCKFROST_API_KEY!;
const provider = new BlockfrostProvider(BLOCKFROST_KEY);

// Utilise les clés de ton wallet
// En production, utilise un hardware wallet ou un KMS
const wallet = new MeshWallet({
  networkId: 0, // 0 = testnet, 1 = mainnet
  fetcher: provider,
  submitter: provider,
  key: {
    type: "mnemonic",
    words: ["ton", "mnemonic", "de", "24", "mots", "..."],
  },
});

async function mintSandjaCoin() {
  const address = await wallet.getChangeAddress();
  const forgingScript = ForgeScript.withOneSignature(address);

  const metadata: AssetMetadata = {
    name: "SandjaCoin",
    ticker: "SNDJ",
    description: "Token natif SANDJA pour récompenser les contributions culturelles",
    image: "ipfs://QmXXXX", // Upload le logo sur IPFS d'abord
    decimals: 6,
    website: "https://sandja.com",
  };

  const asset: Mint = {
    assetName: "SandjaCoin",
    assetQuantity: "100000000000000", // 100M * 10^6 (decimals)
    metadata,
    label: "721",
    recipient: address,
  };

  const tx = new Transaction({ initiator: wallet });
  tx.mintAsset(forgingScript, asset);

  const unsignedTx = await tx.build();
  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);

  console.log("✅ SandjaCoin minté ! Tx hash:", txHash);
  console.log("Policy ID:", forgingScript); // Note ce policy ID !
}

mintSandjaCoin().catch(console.error);