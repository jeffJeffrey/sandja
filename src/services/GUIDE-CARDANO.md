# 🪙 Guide : Créer le SandjaCoin et les NFTs SANDJA sur Cardano

## Vue d'ensemble

Sur Cardano, les tokens (comme SandjaCoin) et les NFTs sont des **native assets** — 
ils vivent directement sur la blockchain sans smart contract. Chaque asset est identifié
par un **Policy ID** (généré à partir d'un script de minting).

---

## ÉTAPE 1 : Préparer l'environnement

### 1.1 Créer un compte Blockfrost (gratuit)
1. Va sur https://blockfrost.io
2. Crée un compte
3. Crée un projet sur le réseau **Preview Testnet**
4. Copie ta **API Key**
5. Ajoute dans `.env.local` :
   ```
   BLOCKFROST_API_KEY=previewXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_BLOCKFROST_API_KEY=previewXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_CARDANO_NETWORK=preview
   ```

### 1.2 Installer un wallet de test
- Installe l'extension **Eternl** ou **Lace** dans ton navigateur
- Crée un wallet sur le réseau **Preview**
- Obtiens des ADA de test depuis le faucet :
  https://docs.cardano.org/cardano-testnet/tools/faucet

---

## ÉTAPE 2 : Créer le SandjaCoin (Token Natif)

### Option A : Via NMKR Studio (recommandé pour commencer)
1. Va sur https://studio.preprod.nmkr.io (testnet)
2. Crée un nouveau projet "SandjaCoin"
3. Configure :
   - Name: SandjaCoin
   - Ticker: SNDJ
   - Decimals: 6
   - Supply: 100,000,000 (100M tokens)
4. Mint les tokens
5. Récupère le **Policy ID** généré
6. Ajoute dans `.env.local` :
   ```
   NEXT_PUBLIC_SANDJA_POLICY_ID=<le_policy_id_obtenu>
   ```

### Option B : Via Mesh SDK (programmatique)
Crée un script `scripts/mint-sandja-coin.ts` :

```typescript
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
  const address = wallet.getChangeAddress();
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
```

---

## ÉTAPE 3 : Créer les NFTs (Certificats de Pagnes)

### Option A : Via NMKR Studio
1. Sur https://studio.preprod.nmkr.io
2. Crée un nouveau projet NFT "SANDJA Pagnes Collection"
3. Pour chaque pagne, upload :
   - L'image du pagne (sera stockée sur IPFS)
   - Les métadonnées (nom, description, région, symboles...)
4. Récupère le **NFT Policy ID**
5. Ajoute dans `.env.local` :
   ```
   NEXT_PUBLIC_NFT_POLICY_ID=<le_nft_policy_id>
   ```

### Option B : Via Mesh SDK (pour mint automatique depuis l'app)
Crée une API route `app/api/nft/mint/route.ts` :

```typescript
import { NextResponse } from "next/server";
import {
  BlockfrostProvider,
  MeshWallet,
  Transaction,
  ForgeScript,
} from "@meshsdk/core";
import type { Mint, AssetMetadata } from "@meshsdk/core";

const provider = new BlockfrostProvider(process.env.BLOCKFROST_API_KEY!);

export async function POST(request: Request) {
  const body = await request.json();
  const { pagneName, description, imageIpfs, region, symbols, recipientAddress } = body;

  // Wallet serveur pour le minting
  const wallet = new MeshWallet({
    networkId: 0,
    fetcher: provider,
    submitter: provider,
    key: {
      type: "mnemonic",
      words: process.env.MINTING_WALLET_MNEMONIC!.split(" "),
    },
  });

  const address = wallet.getChangeAddress();
  const forgingScript = ForgeScript.withOneSignature(address);

  const metadata: AssetMetadata = {
    name: pagneName,
    description,
    image: imageIpfs,
    mediaType: "image/jpeg",
    // Métadonnées SANDJA custom
    region,
    symbols: symbols.join(","),
    collection: "SANDJA Pagnes",
    website: "https://sandja.com",
  };

  const asset: Mint = {
    assetName: pagneName.replace(/\s/g, ""),
    assetQuantity: "1", // NFT = quantité 1
    metadata,
    label: "721", // Standard CIP-25
    recipient: recipientAddress,
  };

  const tx = new Transaction({ initiator: wallet });
  tx.mintAsset(forgingScript, asset);

  const unsignedTx = await tx.build();
  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);

  return NextResponse.json({ txHash, success: true });
}
```

---

## ÉTAPE 4 : Variables d'environnement finales

Après avoir créé le token et la collection NFT, ton `.env.local` devrait contenir :

```env
# Blockfrost
BLOCKFROST_API_KEY=previewXXXXXXXXXXXXXX
NEXT_PUBLIC_BLOCKFROST_API_KEY=previewXXXXXXXXXXXXXX
NEXT_PUBLIC_CARDANO_NETWORK=preview

# Token SandjaCoin
NEXT_PUBLIC_SANDJA_POLICY_ID=<policy_id_du_token>

# NFT Collection
NEXT_PUBLIC_NFT_POLICY_ID=<policy_id_des_nfts>

# Wallet de minting (côté serveur uniquement, JAMAIS NEXT_PUBLIC_)
MINTING_WALLET_MNEMONIC="mot1 mot2 mot3 ... mot24"
```

---

## RÉSUMÉ DES ÉTAPES

1. ✅ Créer compte Blockfrost → obtenir API key
2. ✅ Installer wallet Eternl/Lace → obtenir ADA de test
3. 🪙 Mint SandjaCoin via NMKR Studio ou script → obtenir Policy ID
4. 🖼️ Mint NFTs via NMKR Studio ou API route → obtenir NFT Policy ID
5. 📝 Remplir les `.env.local` avec les Policy IDs
6. ✅ L'app détecte automatiquement les tokens/NFTs dans le wallet connecté
