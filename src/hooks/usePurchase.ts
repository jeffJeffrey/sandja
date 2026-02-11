"use client";

import { useState, useCallback } from "react";
import { useCardanoWallet } from "./useCardanoWallet";
import { getExplorerTxUrl } from "@/config/blockchain";
import { toast } from "sonner";

export type PurchaseStatus =
  | "idle"
  | "building"
  | "signing"
  | "submitting"
  | "confirming"
  | "success"
  | "error";

export interface PurchaseResult {
  txHash: string;
  explorerUrl: string;
  adaPaid: number;
  itemType: string;
  itemId: string;
}

export function usePurchase() {
  const { walletApi, connected, address } = useCardanoWallet();
  const [status, setStatus] = useState<PurchaseStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PurchaseResult | null>(null);

  const purchase = useCallback(
    async (itemType: "nft" | "pagne", itemId: string, priceAda?: number) => {
      if (!walletApi || !connected || !address) {
        toast.error("Connectez votre wallet d'abord");
        return null;
      }

      setStatus("building");
      setError(null);
      setResult(null);

      try {
        // 1. Get purchase params
        const res = await fetch("/api/purchase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ buyerAddress: address, itemType, itemId, priceAda }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        const { transaction } = await res.json();

        toast.info(`Paiement de ${transaction.priceAda} ADA...`, {
          description: "Construction de la transaction...",
        });

        // 2. Build unsigned CBOR server-side
        const buildRes = await fetch("/api/purchase/build-tx", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderAddress: address,
            sellerAddress: transaction.sellerAddress,
            lovelaceAmount: transaction.lovelaceAmount,
            message: transaction.message,
          }),
        });

        const buildData = await buildRes.json();

        if (buildData.fallback) {
          // Blockfrost tx/build not available — manual payment
          toast.info("Paiement manuel requis", {
            description: `Envoyez ${transaction.priceAda} ADA à ${transaction.sellerAddress.slice(0, 20)}...`,
            duration: 15000,
          });
          setStatus("idle");
          return null;
        }

        if (!buildRes.ok) throw new Error(buildData.error);

        // 3. Sign with CIP-30 wallet
        setStatus("signing");
        toast.info("Confirmez dans votre wallet...");

        const signedTx = await walletApi.signTx(buildData.unsignedTxCbor, true);

        // 4. Submit via CIP-30
        setStatus("submitting");
        const txHash = await walletApi.submitTx(signedTx);

        // 5. Success
        setStatus("confirming");
        const purchaseResult: PurchaseResult = {
          txHash,
          explorerUrl: getExplorerTxUrl(txHash),
          adaPaid: transaction.priceAda,
          itemType,
          itemId,
        };
        setResult(purchaseResult);
        setStatus("success");

        toast.success("Transaction soumise ! 🎉", {
          description: `TxHash: ${txHash.slice(0, 20)}...`,
          action: {
            label: "Voir sur l'explorer",
            onClick: () => window.open(purchaseResult.explorerUrl, "_blank"),
          },
        });

        // Verify after delay
        setTimeout(async () => {
          try {
            const v = await fetch(`/api/purchase?txHash=${txHash}`);
            const vd = await v.json();
            if (vd.verified) toast.success("Achat confirmé sur la blockchain !");
          } catch {}
        }, 20_000);

        return purchaseResult;
      } catch (err: any) {
        const msg = err?.message || "Échec de l'achat";
        setError(msg);
        setStatus("error");

        if (msg.includes("declined") || msg.includes("cancel") || msg.includes("refuse")) {
          toast.error("Transaction annulée");
        } else {
          toast.error("Erreur", { description: msg });
        }
        return null;
      }
    },
    [walletApi, connected, address]
  );

  const claimSndj = useCallback(async () => {
    if (!connected || !address) {
      toast.error("Connectez votre wallet d'abord");
      return null;
    }
    setStatus("building");
    setError(null);

    try {
      const res = await fetch("/api/claim-sndj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimerAddress: address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStatus("success");
      toast.success(`${data.claim.amount} SNDJ réclamés !`, { description: data.claim.message });
      return data.claim;
    } catch (err: any) {
      setError(err.message);
      setStatus("error");
      toast.error(err.message);
      return null;
    }
  }, [connected, address]);

  const fetchAssets = useCallback(async () => {
    if (!address) return null;
    try {
      const res = await fetch(`/api/wallet-assets?address=${address}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }, [address]);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setResult(null);
  }, []);

  return {
    status,
    error,
    result,
    purchase,
    claimSndj,
    fetchAssets,
    reset,
    isProcessing: ["building", "signing", "submitting", "confirming"].includes(status),
  };
}