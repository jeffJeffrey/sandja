// // src/stores/wallet-store.ts
// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import type { WalletState, WalletAsset } from "@/types";

// interface WalletStore extends WalletState {
//   assets: WalletAsset[];
//   isConnecting: boolean;
//   error: string | null;
  
//   // Actions
//   connect: (walletName: string) => Promise<void>;
//   disconnect: () => void;
//   refreshBalance: () => Promise<void>;
//   refreshAssets: () => Promise<void>;
//   setError: (error: string | null) => void;
// }

// export const useWalletStore = create<WalletStore>()(
//   persist(
//     (set, get) => ({
//       isConnected: false,
//       address: null,
//       balance: 0,
//       walletName: null,
//       networkId: null,
//       assets: [],
//       isConnecting: false,
//       error: null,
      
//       connect: async (walletName: string) => {
//         set({ isConnecting: true, error: null });
        
//         try {
//           // Vérifier si le wallet est disponible
//           if (typeof window === "undefined") {
//             throw new Error("Window not available");
//           }
          
//           const cardano = (window as any).cardano;
//           if (!cardano || !cardano[walletName]) {
//             throw new Error(`Wallet ${walletName} not found. Please install it.`);
//           }
          
//           // Activer le wallet
//           const wallet = await cardano[walletName].enable();
          
//           // Obtenir l'adresse
//           const addresses = await wallet.getUsedAddresses();
//           const address = addresses[0] || (await wallet.getUnusedAddresses())[0];
          
//           // Obtenir le solde
//           const balanceHex = await wallet.getBalance();
//           // Le solde est en CBOR, on simplifie ici
//           const balance = parseInt(balanceHex, 16) || 0;
          
//           // Obtenir le network ID
//           const networkId = await wallet.getNetworkId();
          
//           set({
//             isConnected: true,
//             address,
//             balance,
//             walletName,
//             networkId,
//             isConnecting: false,
//           });
          
//           // Rafraîchir les assets
//           await get().refreshAssets();
//         } catch (error) {
//           set({
//             isConnecting: false,
//             error: error instanceof Error ? error.message : "Connection failed",
//           });
//         }
//       },
      
//       disconnect: () => {
//         set({
//           isConnected: false,
//           address: null,
//           balance: 0,
//           walletName: null,
//           networkId: null,
//           assets: [],
//           error: null,
//         });
//       },
      
//       refreshBalance: async () => {
//         const { walletName, isConnected } = get();
        
//         if (!isConnected || !walletName) return;
        
//         try {
//           const cardano = (window as any).cardano;
//           const wallet = await cardano[walletName].enable();
//           const balanceHex = await wallet.getBalance();
//           const balance = parseInt(balanceHex, 16) || 0;
          
//           set({ balance });
//         } catch (error) {
//           console.error("Failed to refresh balance:", error);
//         }
//       },
      
//       refreshAssets: async () => {
//         const { walletName, isConnected } = get();
        
//         if (!isConnected || !walletName) return;
        
//         try {
//           // TODO: Implémenter la récupération des NFTs via Blockfrost API
//           // Pour le prototype, on utilise des données mockées
//           set({ assets: [] });
//         } catch (error) {
//           console.error("Failed to refresh assets:", error);
//         }
//       },
      
//       setError: (error: string | null) => {
//         set({ error });
//       },
//     }),
//     {
//       name: "sandja-wallet",
//       partialize: (state: { walletName: any; }) => ({
//         walletName: state.walletName,
//         // Ne pas persister les données sensibles
//       }),
//     }
//   )
// );
