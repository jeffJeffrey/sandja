// import { setRequestLocale } from "next-intl/server";
// import type { Metadata } from "next";
// import dynamic from "next/dynamic";

// // Dynamic import with SSR disabled - @meshsdk/react uses
// // native crypto modules (libsodium) that can't be bundled for SSR
// const WalletContent = dynamic(
//   () =>
//     import("@/components/wallet/wallet-content").then(
//       (mod) => mod.WalletContent
//     ),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="container mx-auto px-4 py-12 flex justify-center">
//         <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full" />
//       </div>
//     ),
//   }
// );

// type Props = {
//   params: Promise<{ locale: string }>;
// };

// export const metadata: Metadata = {
//   title: "Wallet | SANDJA",
//   description: "Gérez votre portefeuille Cardano et vos actifs SANDJA",
// };

// export default async function WalletPage({ params }: Props) {
//   const { locale } = await params;
//   setRequestLocale(locale);

//   return <WalletContent />;
// }