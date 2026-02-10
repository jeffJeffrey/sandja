# SANDJA Blockchain Integration - Guide d'installation

## 📦 Fichiers

```
src/config/blockchain.ts          ← Config mise à jour (remplace l'ancien)
src/services/blockfrost.ts        ← Service Blockfrost (NOUVEAU)
src/services/transaction-builder.ts ← Builder de tx (NOUVEAU)
src/hooks/usePurchase.ts           ← Hook d'achat (NOUVEAU)
app/api/purchase/route.ts          ← API achat (NOUVEAU)
app/api/purchase/build-tx/route.ts ← API build tx CBOR (NOUVEAU)
app/api/claim-sndj/route.ts       ← API claim SNDJ (NOUVEAU)
app/api/wallet-assets/route.ts    ← API assets wallet (NOUVEAU)
```

## 🔧 Installation

### 1. Ajoute dans `.env.local`
```
SELLER_WALLET_ADDRESS=addr_test1qrnacf9s53uce4u0nq72mut2qlszrxlpmpu8z2zdx80xywq5xs7n49j8yh36pl44hgp7kf6vfak2wppy98cst5ru0z7qg3enuq
```

### 2. Copie les fichiers dans ton projet

### 3. Aucune dépendance à installer !
Tout fonctionne avec `fetch` natif + CIP-30 natif. Zero @meshsdk.

## 🛒 Comment acheter un NFT/Pagne (flux complet)

### Côté composant (ex: product-detail.tsx):
```tsx
import { usePurchase } from "@/hooks/usePurchase";

function BuyButton({ productId, price }: { productId: string; price: number }) {
  const { purchase, status, result, isProcessing } = usePurchase();
  
  const handleBuy = async () => {
    const res = await purchase("nft", productId, price);
    if (res) {
      console.log("Achat réussi!", res.txHash);
      window.open(res.explorerUrl, "_blank");
    }
  };

  return (
    <button onClick={handleBuy} disabled={isProcessing}>
      {status === "signing" ? "Confirmez dans le wallet..." :
       status === "submitting" ? "Soumission..." :
       status === "success" ? "✅ Acheté !" :
       `Acheter (${price} ADA)`}
    </button>
  );
}
```

### Flux technique:
1. Client → POST `/api/purchase` (params: buyerAddress, itemType, itemId, priceAda)
2. API → retourne sellerAddress + lovelaceAmount
3. Client → POST `/api/purchase/build-tx` (senderAddress, sellerAddress, lovelaceAmount)
4. API → Blockfrost construit CBOR non signé → retourne unsignedTxCbor
5. Client → `wallet.signTx(unsignedTxCbor)` via CIP-30
6. Client → `wallet.submitTx(signedTx)` → txHash
7. Client → GET `/api/purchase?txHash=xxx` pour vérifier

## 🪙 Comment claim des SNDJ (faucet)

```tsx
const { claimSndj } = usePurchase();
await claimSndj(); // Enregistre la réclamation
```

Note: Sur Preview, le transfer réel de SNDJ nécessite que tu envoies
manuellement les tokens depuis ton wallet. L'API enregistre les claims.

## 🧪 Comment tester

### Étape 1: Obtenir des tADA (testnet ADA)
- Va sur https://docs.cardano.org/cardano-testnet/tools/faucet
- Sélectionne "Preview"
- Colle l'adresse de ton wallet Preview
- Tu recevras ~1000 tADA

### Étape 2: Connecter ton wallet
- Installe Eternl ou Lace extension
- Crée/restaure un wallet sur le réseau Preview
- Connecte-toi sur SANDJA

### Étape 3: Acheter
- Va sur un produit dans le marketplace
- Clique "Acheter maintenant"
- Confirme la transaction dans ton wallet
- La transaction sera visible sur preview.cardanoscan.io

## 🔗 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/purchase | Prépare les params d'achat |
| POST | /api/purchase/build-tx | Construit le CBOR non signé |
| GET | /api/purchase?txHash=xx | Vérifie une transaction |
| POST | /api/claim-sndj | Réclame des SNDJ gratuits |
| GET | /api/claim-sndj?address=xx | Vérifie le solde SNDJ |
| GET | /api/wallet-assets?address=xx | Assets réels du wallet |
