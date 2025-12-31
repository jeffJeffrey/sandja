// src/components/layout/footer.tsx
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Mail,
  MapPin,
  Phone
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
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <span className="font-heading text-xl font-bold text-white">
                SANDJA
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">
              {t("description")}
            </p>
            
            {/* Contact info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Dschang, Cameroun</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
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
                  className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all"
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
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
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
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
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
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
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
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
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
            <p className="text-sm text-gray-500">
              {t("copyright", { year: currentYear })}
            </p>
            
            {/* Badge Cardano */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Propulsé par</span>
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  ₳
                </div>
                <span className="text-gray-300">Cardano</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
