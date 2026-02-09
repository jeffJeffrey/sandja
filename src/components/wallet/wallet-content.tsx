// "use client";

// import { useTranslations } from "next-intl";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Wallet,
//   Link2,
//   Unlink,
//   RefreshCw,
//   Copy,
//   ExternalLink,
//   Coins,
//   ImageIcon,
//   ArrowUpRight,
//   ArrowDownLeft,
//   AlertCircle,
//   Check,
//   Loader2,
//   Download,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useWallet, useWalletList } from "@meshsdk/react";
// import { blockchainConfig } from "@/config/blockchain";
// import {
//   formatLovelace,
//   shortenAddress,
//   parseAssets,
//   isSandjaCoin,
//   isSandjaNft,
//   getExplorerUrl,
//   type ParsedAsset,
// } from "@/services/cardano-client.utils";
// import { useAuthStore } from "@/stores/auth-store";
// import { useState, useEffect, useCallback } from "react";
// import { cn } from "@/lib/utils";
// import { toast } from "sonner";

// type WalletTab = "assets" | "nfts" | "transactions";

// interface WalletBalance {
//   lovelace: string;
//   adaFormatted: string;
//   sandjaCoin: string;
//   assets: ParsedAsset[];
//   nfts: ParsedAsset[];
// }

// export function WalletContent() {
//   const t = useTranslations("wallet");
//   const tCommon = useTranslations("common");

//   // Direct useWallet — safe because this component is loaded with ssr: false
//   const {
//     wallet,
//     connected,
//     name: walletName,
//     connecting,
//     connect,
//     disconnect,
//   } = useWallet();

//   const installedWallets = useWalletList();
//   const { setWalletAddress, updateUser } = useAuthStore();

//   const [address, setAddress] = useState("");
//   const [balance, setBalance] = useState<WalletBalance | null>(null);
//   const [isLoadingBalance, setIsLoadingBalance] = useState(false);
//   const [activeTab, setActiveTab] = useState<WalletTab>("assets");
//   const [isCopied, setIsCopied] = useState(false);

//   const fetchBalance = useCallback(async () => {
//     if (!wallet) return;
//     setIsLoadingBalance(true);
//     try {
//       const rawBalance = await wallet.getBalance();
//       const lovelaceAsset = rawBalance.find((a: any) => a.unit === "lovelace");
//       const lovelace = lovelaceAsset?.quantity || "0";
//       const parsed = parseAssets(rawBalance);
//       const sndj = parsed.find((a) => isSandjaCoin(a.unit));
//       const sandjaCoinAmount = sndj?.quantity || "0";
//       const nfts = parsed.filter((a) => a.unit !== "lovelace" && isSandjaNft(a.policyId));
//       const assets = parsed.filter(
//         (a) => a.unit !== "lovelace" && !isSandjaNft(a.policyId) && !isSandjaCoin(a.unit)
//       );
//       setBalance({ lovelace, adaFormatted: formatLovelace(lovelace), sandjaCoin: sandjaCoinAmount, assets, nfts });
//       if (sandjaCoinAmount !== "0") {
//         updateUser({ sandjaCoin: Number(sandjaCoinAmount) / Math.pow(10, 6) });
//       }
//     } catch (err) {
//       console.error("Failed to get balance:", err);
//     } finally {
//       setIsLoadingBalance(false);
//     }
//   }, [wallet, updateUser]);

//   useEffect(() => {
//     if (connected && wallet) {
//       wallet.getChangeAddress().then((addr: string) => {
//         setAddress(addr);
//         setWalletAddress(addr);
//       });
//       fetchBalance();
//     } else {
//       setAddress("");
//       setBalance(null);
//       setWalletAddress(null);
//     }
//   }, [connected, wallet]);

//   const shortAddress = shortenAddress(address);

//   const copyAddress = () => {
//     if (!address) return;
//     navigator.clipboard.writeText(address);
//     setIsCopied(true);
//     toast.success(t("addressCopied"));
//     setTimeout(() => setIsCopied(false), 2000);
//   };

//   const connectWallet = async (walletId: string) => {
//     try {
//       await connect(walletId);
//       toast.success("Wallet connecté !");
//     } catch {
//       toast.error("Échec de la connexion au wallet");
//     }
//   };

//   const disconnectWallet = () => {
//     disconnect();
//     setAddress("");
//     setBalance(null);
//     setWalletAddress(null);
//     toast.success("Wallet déconnecté");
//   };

//   const supportedWallets = blockchainConfig.supportedWallets;
//   const tabs = [
//     { id: "assets" as const, label: t("tabs.assets"), icon: Coins },
//     { id: "nfts" as const, label: t("tabs.nfts"), icon: ImageIcon },
//     { id: "transactions" as const, label: t("tabs.transactions"), icon: ArrowUpRight },
//   ];

//   const mockTransactions = [
//     { id: "1", type: "received" as const, amount: "+50 SNDJ", description: t("transactions.quizReward"), date: "2025-02-08" },
//     { id: "2", type: "sent" as const, amount: "-2 ADA", description: t("transactions.nftPurchase"), date: "2025-02-07" },
//     { id: "3", type: "received" as const, amount: "+100 SNDJ", description: t("transactions.dailyReward"), date: "2025-02-06" },
//   ];

//   return (
//     <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-heading font-bold text-gray-900">{t("title")}</h1>
//         {connected && (
//           <Button variant="ghost" size="sm" onClick={fetchBalance} disabled={isLoadingBalance} className="gap-2">
//             <RefreshCw className={cn("w-4 h-4", isLoadingBalance && "animate-spin")} />
//             {tCommon("retry")}
//           </Button>
//         )}
//       </div>

//       {!connected ? (
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
//           <div className="p-6 bg-linear-to-br from-primary-600 to-secondary-DEFAULT text-white text-center">
//             <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
//               <Wallet className="w-8 h-8" />
//             </div>
//             <h2 className="text-xl font-heading font-bold">{t("connectTitle")}</h2>
//             <p className="mt-2 text-sm text-white/70 max-w-md mx-auto">{t("connectSubtitle")}</p>
//           </div>

//           <div className="p-6 space-y-3">
//             <p className="text-sm font-medium text-gray-500 mb-4">{t("selectWallet")}</p>
//             {supportedWallets.map((w) => {
//               const isInstalled = installedWallets.some((iw: any) => iw.id === w.id || iw.name?.toLowerCase() === w.id);
//               return (
//                 <button
//                   key={w.id}
//                   onClick={() => (isInstalled ? connectWallet(w.id) : window.open(w.downloadUrl, "_blank"))}
//                   disabled={connecting}
//                   className={cn(
//                     "w-full flex items-center gap-4 px-4 py-3 rounded-xl border transition-all",
//                     isInstalled ? "border-gray-200 hover:border-primary-300 hover:bg-primary-50" : "border-gray-100 bg-gray-50 opacity-70"
//                   )}
//                 >
//                   <img src={w.icon} alt={w.name} className="w-10 h-10 rounded-lg" />
//                   <div className="flex-1 text-left">
//                     <div className="font-medium text-gray-900">{w.name}</div>
//                     <div className="text-xs text-gray-500">{isInstalled ? t("walletInstalled") : t("walletNotInstalled")}</div>
//                   </div>
//                   {isInstalled ? (
//                     connecting ? <Loader2 className="w-5 h-5 text-primary-500 animate-spin" /> : <Link2 className="w-5 h-5 text-primary-500" />
//                   ) : (
//                     <Download className="w-5 h-5 text-gray-400" />
//                   )}
//                 </button>
//               );
//             })}
//             {installedWallets.length === 0 && (
//               <div className="text-center py-4 text-sm text-gray-500 flex items-center justify-center gap-2">
//                 <AlertCircle className="w-4 h-4" />
//                 {t("noWalletsDetected")}
//               </div>
//             )}
//           </div>
//         </motion.div>
//       ) : (
//         <>
//           {/* Connected */}
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
//             <div className="p-6 bg-linear-to-br from-primary-600 to-secondary-DEFAULT text-white">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-2">
//                   <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center"><Wallet className="w-4 h-4" /></div>
//                   <div>
//                     <div className="text-sm text-white/70">{walletName && walletName.charAt(0).toUpperCase() + walletName.slice(1)}</div>
//                     <button onClick={copyAddress} className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white/90 transition-colors">
//                       <span className="font-mono">{shortAddress}</span>
//                       {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
//                     </button>
//                   </div>
//                 </div>
//                 <Button variant="ghost" size="sm" onClick={disconnectWallet} className="text-white/70 hover:text-white hover:bg-white/10">
//                   <Unlink className="w-4 h-4 mr-1.5" />{t("disconnect")}
//                 </Button>
//               </div>

//               <div className="text-center py-4">
//                 {isLoadingBalance ? (
//                   <Loader2 className="w-8 h-8 mx-auto animate-spin text-white/50" />
//                 ) : (
//                   <>
//                     <div className="text-4xl font-bold font-heading">{balance?.adaFormatted || "0.00"} <span className="text-lg text-white/70">₳</span></div>
//                     <div className="text-sm text-white/60 mt-1">{t("mainBalance")}</div>
//                   </>
//                 )}
//               </div>

//               <div className="grid grid-cols-3 gap-3 mt-4">
//                 <div className="text-center bg-white/10 rounded-xl p-3">
//                   <div className="flex items-center justify-center gap-1">
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#DAA520" /><text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#8B6914" fontFamily="sans-serif">S</text></svg>
//                     <span className="font-semibold">{balance?.sandjaCoin || "0"}</span>
//                   </div>
//                   <div className="text-[11px] text-white/50 mt-0.5">SNDJ</div>
//                 </div>
//                 <div className="text-center bg-white/10 rounded-xl p-3">
//                   <div className="font-semibold">{balance?.nfts.length || 0}</div>
//                   <div className="text-[11px] text-white/50 mt-0.5">NFTs</div>
//                 </div>
//                 <div className="text-center bg-white/10 rounded-xl p-3">
//                   <div className="font-semibold">{balance?.assets.length || 0}</div>
//                   <div className="text-[11px] text-white/50 mt-0.5">{t("tabs.assets")}</div>
//                 </div>
//               </div>
//             </div>

//             <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
//               <a href={getExplorerUrl("address", address)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors">
//                 {t("viewOnExplorer")}<ExternalLink className="w-3.5 h-3.5" />
//               </a>
//             </div>
//           </motion.div>

//           {/* Tabs */ }
//           <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
//             {tabs.map((tab) => (
//               <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all", activeTab === tab.id ? "bg-white text-primary-700 shadow-sm" : "text-gray-500 hover:text-gray-700")}>
//                 <tab.icon className="w-4 h-4" />{tab.label}
//               </button>
//             ))}
//           </div>

//           <AnimatePresence mode="wait">
//             {activeTab === "assets" && (
//               <motion.div key="assets" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
//                 <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
//                   <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">₳</div>
//                   <div className="flex-1"><div className="font-medium text-gray-900">Cardano</div><div className="text-xs text-gray-500">ADA</div></div>
//                   <div className="font-semibold text-gray-900">{balance?.adaFormatted || "0"} ₳</div>
//                 </div>
//                 <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
//                   <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#DAA520" /><circle cx="12" cy="12" r="8" fill="#F5D060" /><text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#8B6914" fontFamily="sans-serif">S</text></svg>
//                   </div>
//                   <div className="flex-1"><div className="font-medium text-gray-900">SandjaCoin</div><div className="text-xs text-gray-500">SNDJ</div></div>
//                   <div className="font-semibold text-gray-900">{balance?.sandjaCoin || "0"} SNDJ</div>
//                 </div>
//                 {balance?.assets.map((asset) => (
//                   <div key={asset.unit} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
//                     <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-mono">{asset.displayName.slice(0, 3)}</div>
//                     <div className="flex-1 min-w-0"><div className="font-medium text-gray-900 truncate">{asset.displayName}</div><div className="text-xs text-gray-400 font-mono truncate">{asset.policyId.slice(0, 12)}...</div></div>
//                     <div className="font-semibold text-gray-900">{asset.quantity}</div>
//                   </div>
//                 ))}
//                 {(!balance || balance.assets.length === 0) && <div className="text-center py-8 text-sm text-gray-400">{t("noAssets")}</div>}
//               </motion.div>
//             )}
//             {activeTab === "nfts" && (
//               <motion.div key="nfts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
//                 {balance && balance.nfts.length > 0 ? (
//                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                     {balance.nfts.map((nft) => (
//                       <div key={nft.unit} className="rounded-xl border border-gray-100 bg-white overflow-hidden hover:shadow-md transition-shadow">
//                         <div className="aspect-square bg-gray-100 flex items-center justify-center"><ImageIcon className="w-8 h-8 text-gray-300" /></div>
//                         <div className="p-3"><div className="text-sm font-medium text-gray-900 truncate">{nft.displayName}</div><div className="text-xs text-gray-400 mt-0.5">SANDJA Collection</div></div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-12">
//                     <ImageIcon className="w-12 h-12 mx-auto text-gray-200 mb-3" />
//                     <div className="text-sm text-gray-400">{t("noNfts")}</div>
//                     <p className="text-xs text-gray-300 mt-1 max-w-xs mx-auto">{t("noNftsDescription")}</p>
//                   </div>
//                 )}
//               </motion.div>
//             )}
//             {activeTab === "transactions" && (
//               <motion.div key="transactions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
//                 {mockTransactions.map((tx) => (
//                   <div key={tx.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
//                     <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", tx.type === "received" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500")}>
//                       {tx.type === "received" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
//                     </div>
//                     <div className="flex-1"><div className="font-medium text-gray-900 text-sm">{tx.description}</div><div className="text-xs text-gray-400">{tx.date}</div></div>
//                     <div className={cn("font-semibold text-sm", tx.type === "received" ? "text-green-600" : "text-red-500")}>{tx.amount}</div>
//                   </div>
//                 ))}
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </>
//       )}
//     </div>
//   );
// }