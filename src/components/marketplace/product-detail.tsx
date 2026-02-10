"use client";
import { usePurchase } from "@/hooks/usePurchase";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Heart, Share2, ShoppingCart, ChevronRight, Star, MapPin,
  Eye, Shield, Truck, Box, Image as ImageIcon, Wallet, Minus, Plus,
  CheckCircle2, ExternalLink, Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FabricViewer3D } from "@/components/3d/fabric-viewer-3d";
import { mockProducts } from "@/data/mock-data";
import { useCardanoWallet } from "@/hooks/useCardanoWallet";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";

type ViewMode = "images" | "3d";

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
    <Button onClick={handleBuy} disabled={isProcessing}>
      {status === "signing" ? "Confirmez dans le wallet..." :
       status === "submitting" ? "Soumission..." :
       status === "success" ? "✅ Acheté !" :
       `Acheter (${price} ADA)`}
    </Button>
  );
}

export function ProductDetail({ slug }: { slug: string }) {
  const t = useTranslations("marketplace");
  const product = mockProducts.find((p) => p.slug === slug) || mockProducts[0];
  const { connected, balance, connect } = useCardanoWallet();
  const { addItem } = useCartStore();

  const [viewMode, setViewMode] = useState<ViewMode>(product.type === "PAGNE" ? "3d" : "images");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      nameKey: product.name,
      price: product.price,
      currency: product.currency,
      type: product.type,
      images: product.images,
    }, quantity);
    toast.success(`${product.name} ajouté au panier`);
  };

  const handleBuyNow = async () => {
    if (!connected) {
      toast.error("Connectez votre wallet d'abord");
      return;
    }
    setIsPurchasing(true);
    // Simulate purchase
    await new Promise((r) => setTimeout(r, 2000));
    toast.success("Achat effectué ! 🎉");
    setIsPurchasing(false);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/marketplace" className="text-gray-500 hover:text-primary-600">Marketplace</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 md:hidden">
          <ArrowLeft className="w-5 h-5" /> Retour
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT - Visual */}
          <div>
            {/* View mode toggle */}
            {product.type === "PAGNE" && (
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setViewMode("3d")}
                  className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    viewMode === "3d" ? "bg-primary-100 text-primary-700 ring-1 ring-primary-200" : "bg-gray-100 text-gray-600")}>
                  <Box className="w-4 h-4" /> Cabine d'essayage 3D
                </button>
                <button onClick={() => setViewMode("images")}
                  className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    viewMode === "images" ? "bg-primary-100 text-primary-700 ring-1 ring-primary-200" : "bg-gray-100 text-gray-600")}>
                  <ImageIcon className="w-4 h-4" /> Photos
                </button>
              </div>
            )}

            <AnimatePresence mode="wait">
              {viewMode === "3d" ? (
                <motion.div key="3d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <FabricViewer3D productName={product.name} colors={product.colors} className="aspect-4/3" />
                </motion.div>
              ) : (
                <motion.div key="images" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                  {imageError ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary-50 to-secondary-50">
                      <div className="text-center">
                        <span className="text-7xl">{product.isNFT ? "🎨" : "🧵"}</span>
                        <p className="mt-3 text-gray-500 font-medium">{product.name}</p>
                      </div>
                    </div>
                  ) : (
                    <Image src={product.images[selectedImage]} alt={product.name} fill className="object-cover"
                      onError={() => setImageError(true)} priority />
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNFT && (
                      <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Shield className="w-3 h-3" /> NFT Certifié
                      </span>
                    )}
                    {product.isNew && (
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">Nouveau</span>
                    )}
                    {product.originalPrice && (
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>

                  <button onClick={() => setIsLiked(!isLiked)}
                    className={cn("absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm",
                      isLiked ? "bg-red-500 text-white" : "bg-white/90 text-gray-700")}>
                    <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Thumbnails */}
            {viewMode === "images" && product.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => { setSelectedImage(i); setImageError(false); }}
                    className={cn("relative w-20 h-20 rounded-xl overflow-hidden border-2",
                      selectedImage === i ? "border-primary-500" : "border-transparent hover:border-gray-300")}>
                    <Image src={img} alt="" fill className="object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT - Purchase Info */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              {/* Seller */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <span className="text-lg">{product.seller.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-gray-900 text-sm">{product.seller.name}</span>
                    {product.seller.isVerified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {product.seller.rating}
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-heading text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-4 h-4", i < Math.floor(product.rating) ? "text-amber-500 fill-amber-500" : "text-gray-300")} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product.reviewCount} avis)</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="flex items-center gap-1 text-sm text-gray-500"><Eye className="w-4 h-4" />{product.viewCount}</span>
              </div>

              {/* Region & Symbols */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                  <MapPin className="w-3.5 h-3.5" />{product.region.flag} {product.region.name}
                </span>
                {product.symbols.map((s) => (
                  <Link key={s.id} href={`/explore/${s.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm hover:bg-primary-100 transition-colors">
                    <Tag className="w-3.5 h-3.5" />{s.name}
                  </Link>
                ))}
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

              {/* Price */}
              <div className="p-6 bg-gray-50 rounded-2xl mb-6">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold text-primary-600">{product.price} {product.currency}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">{product.originalPrice} {product.currency}</span>
                  )}
                </div>

                {/* Quantity */}
                {!product.isNFT && (
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-gray-600">Quantité :</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-400">{product.stock} disponible(s)</span>
                  </div>
                )}

                {/* Wallet status */}
                {!connected ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4">
                    <p className="text-sm text-amber-700 flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Connectez votre wallet Cardano pour acheter
                    </p>
                    <button onClick={() => connect("eternl")}
                      className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700">
                      Connecter un wallet →
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl mb-4">
                    <p className="text-sm text-green-700 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Wallet connecté • Solde : {balance?.adaFormatted || "0"} ₳
                    </p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3">
                  <BuyButton productId={product.id} price={product.price} />
                  <Button variant="outline" onClick={handleAddToCart} className="gap-2 py-6">
                    <ShoppingCart className="w-5 h-5" />
                  </Button>
                </div>

                {/* NFT info */}
                {product.isNFT && (
                  <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">NFT Certifié Cardano</span>
                    </div>
                    <p className="text-xs text-purple-600">Propriété vérifiable sur la blockchain. Édition limitée unique.</p>
                    {product.nftPolicyId && (
                      <p className="text-xs text-purple-400 font-mono mt-1">Policy: {product.nftPolicyId}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Details */}
              {product.material && (
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Matériau</span>
                    <span className="text-gray-900 font-medium">{product.material}</span>
                  </div>
                  {product.dimensions && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Dimensions</span>
                      <span className="text-gray-900 font-medium">{product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Condition</span>
                    <span className="text-gray-900 font-medium">{product.condition === "HANDMADE" ? "Fait main" : product.condition === "NEW" ? "Neuf" : "Vintage"}</span>
                  </div>
                </div>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <Shield className="w-5 h-5 mx-auto text-primary-500 mb-1" />
                  <p className="text-xs text-gray-600">Authenticité certifiée</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <Truck className="w-5 h-5 mx-auto text-primary-500 mb-1" />
                  <p className="text-xs text-gray-600">Livraison mondiale</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <Wallet className="w-5 h-5 mx-auto text-primary-500 mb-1" />
                  <p className="text-xs text-gray-600">Paiement Cardano</p>
                </div>
              </div>

              {/* Colors */}
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Couleurs</p>
                <div className="flex gap-2">
                  {product.colors.map((color, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white shadow" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
