"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { HoverLift } from "@/components/common";

const mockRelatedSymbols = [
  {
    id: "2",
    slug: "ndop-lizard",
    name: "Le Lézard",
    category: "ANIMAL",
    image: "/images/symbols/ndop-lizard.svg",
    region: "Cameroun Ouest",
  },
  {
    id: "3",
    slug: "adinkra-sankofa",
    name: "Sankofa",
    category: "ANIMAL",
    image: "/images/symbols/adinkra-sankofa.svg",
    region: "Ghana Ashanti",
  },
  {
    id: "4",
    slug: "ndop-double-gong",
    name: "Double Gong",
    category: "OBJECT",
    image: "/images/symbols/ndop-double-gong.svg",
    region: "Cameroun Ouest",
  },
  {
    id: "5",
    slug: "bogolan-crocodile",
    name: "Le Crocodile",
    category: "ANIMAL",
    image: "/images/symbols/bogolan-crocodile.svg",
    region: "Mali Dogon",
  },
];

interface RelatedSymbolsProps {
  currentSlug: string;
}

export function RelatedSymbols({ currentSlug }: RelatedSymbolsProps) {
  const t = useTranslations("symbolDetail");
  
  const symbols = mockRelatedSymbols.filter((s) => s.slug !== currentSlug);

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl font-bold text-gray-900">
            {t("relatedSymbols")}
          </h2>
          <Link
            href="/explore"
            className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
          >
            {t("viewAll")}
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {symbols.map((symbol, index) => (
            <motion.div
              key={symbol.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <HoverLift>
                <Link href={`/explore/${symbol.slug}`}>
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all">
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={symbol.image}
                        alt={symbol.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/placeholder-symbol.svg";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-1">{symbol.region}</p>
                      <h3 className="font-semibold text-gray-900">{symbol.name}</h3>
                    </div>
                  </div>
                </Link>
              </HoverLift>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}