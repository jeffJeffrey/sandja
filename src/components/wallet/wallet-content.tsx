// src/components/wallet/wallet-content.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet, Copy, ExternalLink, RefreshCw, LogOut, ChevronRight,
  Smartphone, Monitor, Download, ArrowUpRight, Shield, QrCode,
  CheckCircle2, AlertCircle, Globe, Coins, Image as ImageIcon,
  ArrowLeftRight, HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCardanoWallet } from "@/hooks/useCardanoWallet";
import { blockchainConfig } from "@/config/blockchain";
import { toast } from "sonner";

type TabId = "assets" | "nfts" | "transactions";

export function WalletContent() {
  const t = useTranslations("wallet");
  const {
    connected, connecting, walletName, address, shortAddress, balance,
    isLoadingBalance, installedWallets, error, connect, disconnect,
    refreshBalance, isMobile, isInDAppBrowser, hasCIP30, mobileWallets,
    supportedWallets, openInWalletBrowser, getInstallUrl,
  } = useCardanoWallet();

  const [activeTab, setActiveTab] = useState<TabId>("assets");

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success(t("addressCopied"));
  };

  // =============================================
  // CONNECTED STATE
  // =============================================
  if (connected) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{walletName}</h2>
                <button onClick={handleCopyAddress}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors">
                  <span className="font-mono">{shortAddress}</span>
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={disconnect} className="gap-2 text-red-600 hover:text-red-700">
              <LogOut className="w-4 h-4" />{t("disconnect")}
            </Button>
          </div>

          {/* Balance */}
          <div className="bg-linear-to-br from-primary-600 to-secondary-DEFAULT rounded-xl p-6 text-white">
            <p className="text-white/60 text-sm mb-1">{t("mainBalance")}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{balance?.adaFormatted || "0.00"}</span>
              <span className="text-white/60">₳ ADA</span>
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10 text-sm">
              <span>SNDJ: 0</span>
              <span>NFTs: 0</span>
              <span>Assets: {balance?.assets.length || 0}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <Button variant="outline" size="sm" onClick={refreshBalance} disabled={isLoadingBalance} className="flex-1 gap-2">
              <RefreshCw className={cn("w-4 h-4", isLoadingBalance && "animate-spin")} />
              {t("balance")}
            </Button>
            <Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
              <a href={`https://cardanoscan.io/address/${address}`} target="_blank" rel="noreferrer">
                <ExternalLink className="w-4 h-4" />{t("viewOnExplorer")}
              </a>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {(["assets", "nfts", "transactions"] as TabId[]).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={cn("flex-1 py-3 text-sm font-medium transition-colors",
                  activeTab === tab ? "text-primary-600 border-b-2 border-primary-500" : "text-gray-500")}>
                {t(`tabs.${tab}`)}
              </button>
            ))}
          </div>
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {activeTab === "assets" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Coins className="w-5 h-5 text-blue-600" />
                        </div>
                        <div><p className="font-medium text-gray-900">ADA</p><p className="text-xs text-gray-500">Cardano</p></div>
                      </div>
                      <span className="font-semibold text-gray-900">{balance?.adaFormatted || "0.00"} ₳</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl opacity-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                          <Coins className="w-5 h-5 text-amber-600" />
                        </div>
                        <div><p className="font-medium text-gray-900">SNDJ</p><p className="text-xs text-gray-500">SandjaCoin</p></div>
                      </div>
                      <span className="font-semibold text-gray-400">0</span>
                    </div>
                  </div>
                )}
                {activeTab === "nfts" && (
                  <div className="text-center py-8">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">{t("noNfts")}</p>
                    <p className="text-sm text-gray-400 mt-1">{t("noNftsDescription")}</p>
                  </div>
                )}
                {activeTab === "transactions" && (
                  <div className="text-center py-8">
                    <ArrowLeftRight className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aucune transaction</p>
                    <p className="text-sm text-gray-400 mt-1">Vos transactions apparaîtront ici</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  // =============================================
  // NOT CONNECTED — ADAPTIVE UI (Desktop vs Mobile)
  // =============================================
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-10 h-10 text-primary-600" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">{t("connectTitle")}</h2>
        <p className="text-gray-500">{t("connectSubtitle")}</p>
      </div>

      {/* Mobile: show instructions if not in DApp browser */}
      {isMobile && !isInDAppBrowser && (
        <MobileWalletConnect
          mobileWallets={mobileWallets}
          onOpenInWallet={openInWalletBrowser}
          getInstallUrl={getInstallUrl}
        />
      )}

      {/* Mobile: inside DApp browser — show normal CIP-30 wallets */}
      {isMobile && isInDAppBrowser && (
        <CIP30WalletList
          wallets={installedWallets}
          supportedWallets={supportedWallets}
          connecting={connecting}
          onConnect={connect}
          getInstallUrl={getInstallUrl}
          isMobile={true}
        />
      )}

      {/* Desktop: show extension wallets */}
      {!isMobile && (
        <CIP30WalletList
          wallets={installedWallets}
          supportedWallets={supportedWallets}
          connecting={connecting}
          onConnect={connect}
          getInstallUrl={getInstallUrl}
          isMobile={false}
        />
      )}

      {/* Error */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div><p className="text-red-700 text-sm font-medium">Erreur de connexion</p><p className="text-red-600 text-sm">{error}</p></div>
        </motion.div>
      )}
    </div>
  );
}

// =============================================
// MOBILE WALLET CONNECT UI
// =============================================

function MobileWalletConnect({
  mobileWallets,
  onOpenInWallet,
  getInstallUrl,
}: {
  mobileWallets: any[];
  onOpenInWallet: (id: string) => void;
  getInstallUrl: (id: string) => string | null;
}) {
  return (
    <div className="space-y-6">
      {/* Explanation card */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Smartphone className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Connexion sur mobile</h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              Sur mobile, vous devez ouvrir SANDJA <strong>depuis le navigateur intégré de votre wallet</strong>.
              Les wallets Cardano mobiles (Eternl, VESPR) ont un navigateur DApp intégré qui permet la connexion.
            </p>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary-500" />
          Comment connecter votre wallet ?
        </h3>
        <div className="space-y-4">
          <Step number={1} title="Ouvrez votre wallet" description="Lancez l'application Eternl, VESPR ou Flint sur votre téléphone" />
          <Step number={2} title="Allez dans le navigateur DApp" description="Cherchez l'icône 'DApp Browser' ou 'Browser' dans le menu de l'app" />
          <Step number={3} title="Naviguez vers SANDJA" description={`Entrez l'adresse : ${typeof window !== "undefined" ? window.location.origin : "sandja.app"}`} />
          <Step number={4} title="Connectez-vous" description="Le wallet se connecte automatiquement dans son navigateur intégré" />
        </div>
      </div>

      {/* Quick open buttons */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Ouvrir dans un wallet</h3>
        <div className="space-y-3">
          {mobileWallets.map((wallet) => (
            <button key={wallet.id} onClick={() => onOpenInWallet(wallet.id)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-primary-50 rounded-xl transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-200">
                  <span className="text-lg font-bold text-primary-600">{wallet.name.charAt(0)}</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{wallet.name}</p>
                  <p className="text-xs text-gray-500">Ouvrir le DApp Browser</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Install wallet section */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Pas encore de wallet ?</h3>
        <p className="text-gray-500 text-sm mb-4">
          Installez un wallet Cardano gratuit pour commencer.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {mobileWallets.slice(0, 4).map((wallet) => {
            const url = getInstallUrl(wallet.id);
            return (
              <a key={wallet.id} href={url || wallet.downloadUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-primary-200 transition-colors">
                <Download className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{wallet.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 text-sm font-bold">
        {number}
      </div>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

// =============================================
// CIP-30 WALLET LIST (Desktop + DApp Browser)
// =============================================

function CIP30WalletList({
  wallets,
  supportedWallets,
  connecting,
  onConnect,
  getInstallUrl,
  isMobile,
}: {
  wallets: any[];
  supportedWallets: any[];
  connecting: boolean;
  onConnect: (id: string) => void;
  getInstallUrl: (id: string) => string | null;
  isMobile: boolean;
}) {
  const installedIds = wallets.map((w) => w.id);

  return (
    <div className="space-y-6">
      {/* Inside DApp browser notice */}
      {isMobile && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-green-800 font-medium text-sm">Navigateur DApp détecté</p>
            <p className="text-green-700 text-xs mt-1">
              Vous êtes dans le navigateur intégré d'un wallet. Sélectionnez votre wallet ci-dessous pour vous connecter.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">{isMobile ? "Wallet détecté" : "Sélectionnez votre wallet"}</h3>

        {wallets.length === 0 && !isMobile ? (
          <div className="text-center py-8">
            <Monitor className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">Aucun wallet détecté</p>
            <p className="text-sm text-gray-400 mb-4">
              Installez une extension de wallet Cardano dans votre navigateur
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {supportedWallets.filter((w: any) => w.storeUrls.chrome).slice(0, 3).map((w: any) => (
                <a key={w.id} href={w.storeUrls.chrome} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                  <Download className="w-4 h-4" />{w.name}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Show installed wallets (detected via CIP-30) */}
            {wallets.map((wallet) => (
              <button key={wallet.id} onClick={() => onConnect(wallet.id)} disabled={connecting}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-primary-50 rounded-xl transition-all group disabled:opacity-50">
                <div className="flex items-center gap-3">
                  {wallet.icon ? (
                    <img src={wallet.icon} alt="" className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-primary-600" />
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{wallet.name}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Installé
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
              </button>
            ))}

            {/* Show uninstalled supported wallets */}
            {!isMobile && supportedWallets
              .filter((w: any) => !installedIds.includes(w.id) && w.storeUrls.chrome)
              .map((w: any) => {
                const url = getInstallUrl(w.id);
                return (
                  <a key={w.id} href={url || w.downloadUrl} target="_blank" rel="noreferrer"
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all group opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-400">{w.name.charAt(0)}</span>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-700">{w.name}</p>
                        <p className="text-xs text-gray-400">Non installé</p>
                      </div>
                    </div>
                    <span className="text-xs text-primary-600 flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> Installer
                    </span>
                  </a>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}