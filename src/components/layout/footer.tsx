"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Mail,
  MapPin,
  Heart
} from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { href: "/explore", label: t("explore") },
      { href: "/marketplace", label: t("marketplace") },
      { href: "/learn", label: t("learn") },
      { href: "/events", label: t("events") },
    ],
    company: [
      { href: "/about", label: t("about") },
      { href: "/team", label: t("team") },
      { href: "/careers", label: t("careers") },
      { href: "/press", label: t("press") },
    ],
    resources: [
      { href: "/docs", label: t("docs") },
      { href: "/blog", label: t("blog") },
      { href: "/faq", label: t("faq") },
      { href: "/support", label: t("support") },
    ],
    legal: [
      { href: "/privacy-policy", label: t("privacy") },
      { href: "/terms-of-service", label: t("terms") },
      { href: "/cookies", label: t("cookies") },
    ],
  };

  const socialLinks = [
    { href: "https://facebook.com/sandja_app", icon: Facebook, label: "Facebook" },
    { href: "https://twitter.com/sandja_app", icon: Twitter, label: "Twitter" },
    { href: "https://instagram.com/sandja_app", icon: Instagram, label: "Instagram" },
    { href: "https://linkedin.com/company/sandja", icon: Linkedin, label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Section principale */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Logo et description */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <Image
                src="/images/logo/logo-icon.svg"
                alt="SANDJA"
                width={40}
                height={40}
                className="w-10 h-10 group-hover:scale-110 transition-transform"
              />
              <span className="font-heading text-xl font-bold text-white">
                SANDJA
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 max-w-xs leading-relaxed">
              {t("description")}
            </p>
            
            {/* Contact info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>Dschang, Cameroun</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4 text-primary-400" />
                <a href="mailto:contact@sandja.app" className="hover:text-white transition-colors">
                  contact@sandja.app
                </a>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Liens - Produit */}
          <div>
            <h3 className="text-white font-semibold mb-4">Produit</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens - Entreprise */}
          <div>
            <h3 className="text-white font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens - Ressources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Ressources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens - Légal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Légal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Section basse */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              {t("copyright", { year: currentYear })} - Fait avec 
              <Heart className="w-4 h-4 text-accent-red fill-accent-red" /> 
              au Cameroun
            </p>
            
            {/* Badge Cardano */}
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>Propulsé par</span>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  ₳
                </div>
                <span className="text-gray-300 font-medium">Cardano</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}