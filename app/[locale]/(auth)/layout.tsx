import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AuthLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex">
      {/* Panneau gauche - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-primary-600 via-primary-500 to-secondary-500 overflow-hidden">
        {/* Motif de fond */}
        <div className="absolute inset-0 african-pattern-ndop opacity-10" />
        
        {/* Contenu */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <Image
              src="/images/logo/logo-icon.svg"
              alt="SANDJA"
              width={48}
              height={48}
              className="w-12 h-12 brightness-0 invert"
            />
            <span className="font-heading text-2xl font-bold">SANDJA</span>
          </Link>

          {/* Message principal */}
          <div className="max-w-md">
            <h1 className="font-heading text-4xl font-bold mb-6 leading-tight">
              Redécouvrez la richesse du patrimoine textile africain
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Rejoignez une communauté passionnée par la préservation et la valorisation 
              des traditions textiles africaines à travers la technologie.
            </p>

            {/* Stats */}
            <div className="flex gap-8 mt-10">
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-white/70">Symboles</div>
              </div>
              <div>
                <div className="text-3xl font-bold">10+</div>
                <div className="text-sm text-white/70">Régions</div>
              </div>
              <div>
                <div className="text-3xl font-bold">1K+</div>
                <div className="text-sm text-white/70">Membres</div>
              </div>
            </div>
          </div>

          {/* Témoignage */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md">
            <p className="text-white/90 italic mb-4">
              "SANDJA m'a permis de reconnecter avec mes racines culturelles. 
              Je comprends maintenant la signification profonde des motifs 
              que portait ma grand-mère."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold">
                AM
              </div>
              <div>
                <div className="font-medium">Aminata M.</div>
                <div className="text-sm text-white/60">Yaoundé, Cameroun</div>
              </div>
            </div>
          </div>
        </div>

        {/* Éléments décoratifs */}
        <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-accent-gold/20 blur-3xl" />
      </div>

      {/* Panneau droit - Formulaire */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}