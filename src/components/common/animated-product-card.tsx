// src/components/common/animated-product-card.tsx
"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Heart, ShoppingCart, Eye, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

interface AnimatedProductCardProps {
  id: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  image: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isNFT?: boolean;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  isInWishlist?: boolean;
  className?: string;
}

export function AnimatedProductCard({
  id,
  slug,
  name,
  description,
  price,
  currency = "ADA",
  image,
  rating = 0,
  reviewCount = 0,
  isNew = false,
  isFeatured = false,
  isNFT = false,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
  className = "",
}: AnimatedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Animation 3D au hover
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative group cursor-pointer perspective-1000",
        className
      )}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ z: 50 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-african-lg transition-shadow duration-300 border border-gray-100">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Link href={`/marketplace/${slug}`}>
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Link>

          {/* Overlay gradient au hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && (
              <motion.span
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="px-2 py-1 text-xs font-semibold bg-accent-green text-white rounded-full"
              >
                Nouveau
              </motion.span>
            )}
            {isFeatured && (
              <motion.span
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="px-2 py-1 text-xs font-semibold bg-accent-gold text-white rounded-full flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Vedette
              </motion.span>
            )}
            {isNFT && (
              <motion.span
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="px-2 py-1 text-xs font-semibold bg-accent-blue text-white rounded-full"
              >
                NFT
              </motion.span>
            )}
          </div>

          {/* Bouton Wishlist */}
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist?.();
            }}
            className={cn(
              "absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              isInWishlist
                ? "bg-accent-red text-white"
                : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-accent-red"
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className={cn("w-5 h-5", isInWishlist && "fill-current")} />
          </motion.button>

          {/* Actions au hover */}
          <motion.div
            className="absolute bottom-3 left-3 right-3 flex gap-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.();
              }}
              className="flex-1 py-2.5 px-4 bg-white rounded-xl font-medium text-sm text-gray-900 flex items-center justify-center gap-2 hover:bg-primary-500 hover:text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingCart className="w-4 h-4" />
              Ajouter
            </motion.button>
            <Link href={`/marketplace/${slug}`}>
              <motion.button
                className="py-2.5 px-4 bg-white/80 backdrop-blur-sm rounded-xl text-gray-600 hover:bg-white hover:text-primary-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3.5 h-3.5",
                    i < Math.floor(rating)
                      ? "text-accent-gold fill-accent-gold"
                      : "text-gray-300"
                  )}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">
                ({reviewCount})
              </span>
            </div>
          )}

          {/* Name */}
          <Link href={`/marketplace/${slug}`}>
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
              {name}
            </h3>
          </Link>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
              {description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-primary-600">
                {formatPrice(price, currency)}
              </span>
            </div>

            {/* Indicateur de stock ou type */}
            <span className="text-xs text-gray-400">
              {isNFT ? "Édition limitée" : "En stock"}
            </span>
          </div>
        </div>

        {/* Effet de brillance au hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at ${x.get() * 100 + 50}% ${y.get() * 100 + 50}%, rgba(218, 165, 32, 0.15), transparent 40%)`,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}

// Grille de produits avec animation staggered
interface ProductGridProps {
  products: Array<{
    id: string;
    slug: string;
    name: string;
    description?: string;
    price: number;
    currency?: string;
    image: string;
    rating?: number;
    reviewCount?: number;
    isNew?: boolean;
    isFeatured?: boolean;
    isNFT?: boolean;
  }>;
  onAddToCart?: (productId: string) => void;
  className?: string;
}

export function AnimatedProductGrid({ products, onAddToCart, className = "" }: ProductGridProps) {
  return (
    <motion.div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
        className
      )}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <AnimatedProductCard
            {...product}
            onAddToCart={() => onAddToCart?.(product.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
