"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const mockRegions = [
  {
    id: "cameroon-west",
    name: "Cameroun Ouest",
    country: "Cameroun",
    symbolCount: 150,
    pagneCount: 45,
    image: "/images/regions/cameroon-west.svg",
    flag: "🇨🇲",
    color: "from-green-500 to-emerald-600",
    description: "Berceau du Ndop royal et des traditions Bamiléké",
  },
  {
    id: "ghana-ashanti",
    name: "Ghana Ashanti",
    country: "Ghana",
    symbolCount: 120,
    pagneCount: 38,
    image: "/images/regions/ghana-ashanti.svg",
    flag: "🇬🇭",
    color: "from-yellow-500 to-amber-600",
    description: "Terre du Kente, tissu des rois Ashanti",
  },
  {
    id: "mali-dogon",
    name: "Mali Dogon",
    country: "Mali",
    symbolCount: 80,
    pagneCount: 25,
    image: "/images/regions/mali-dogon.svg",
    flag: "🇲🇱",
    color: "from-orange-500 to-red-600",
    description: "Origine du Bogolan, l'art de la boue",
  },
  {
    id: "senegal",
    name: "Sénégal",
    country: "Sénégal",
    symbolCount: 65,
    pagneCount: 20,
    image: "/images/regions/senegal.svg",
    flag: "🇸🇳",
    color: "from-teal-500 to-cyan-600",
    description: "Traditions textiles wolof et sérères",
  },
];

interface RegionCardProps {
  region: typeof mockRegions[0];
  index: number;
}

function RegionCard({ region, index }: RegionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/map?region=${region.id}`}>
        <div className="group relative h-70 rounded-2xl overflow-hidden cursor-pointer">
          {/* Background Image */}
          <div className="absolute inset-0 bg-gray-200">
            <Image
              src={region.image}
              alt={region.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>

          {/* linear Overlay */}
          <div className={cn(
            "absolute inset-0 bg-linear-to-t opacity-80 group-hover:opacity-90 transition-opacity",
            region.color
          )} />

          {/* Pattern overlay */}
          <div className="absolute inset-0 african-pattern-zigzag opacity-10" />

          {/* Content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
            {/* Top */}
            <div className="flex items-start justify-between">
              <span className="text-4xl">{region.flag}</span>
              <motion.div
                initial={{ x: 10, opacity: 0 }}
                whileHover={{ x: 0, opacity: 1 }}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full"
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </div>

            {/* Bottom */}
            <div>
              <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                <MapPin className="w-4 h-4" />
                {region.country}
              </div>
              <h3 className="font-heading text-2xl font-bold mb-2">
                {region.name}
              </h3>
              <p className="text-sm text-white/80 line-clamp-2 mb-4">
                {region.description}
              </p>
              
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                  {region.symbolCount} symboles
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                  {region.pagneCount} pagnes
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function RegionsSection() {
  const t = useTranslations("explore");

  return (
    <section className="mt-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-heading text-3xl font-bold text-gray-900 mb-2">
            {t("regions.title")}
          </h2>
          <p className="text-gray-600">
            {t("regions.subtitle")}
          </p>
        </div>
        <Link
          href="/map"
          className="hidden md:flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          {t("regions.viewAll")}
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockRegions.map((region, index) => (
          <RegionCard key={region.id} region={region} index={index} />
        ))}
      </div>

      {/* Mobile view all */}
      <div className="mt-8 text-center md:hidden">
        <Link
          href="/map"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-50 text-primary-600 rounded-xl font-medium"
        >
          {t("regions.viewAll")}
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}