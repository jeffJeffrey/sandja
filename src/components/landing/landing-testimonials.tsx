// src/components/landing/landing-testimonials.tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Aminata Diallo",
    role: "Designer textile",
    location: "Dakar, Sénégal",
    avatar: "👩🏿‍🎨",
    rating: 5,
    text: "SANDJA m'a permis de redécouvrir le sens profond des motifs que j'utilisais depuis des années sans vraiment les comprendre. Une révélation !",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: 2,
    name: "Kwame Asante",
    role: "Professeur d'histoire",
    location: "Accra, Ghana",
    avatar: "👨🏿‍🏫",
    rating: 5,
    text: "Enfin une plateforme qui documente notre patrimoine textile de manière scientifique tout en le rendant accessible à tous.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: 3,
    name: "Marie-Claire Njoya",
    role: "Styliste",
    location: "Douala, Cameroun",
    avatar: "👩🏿‍💼",
    rating: 5,
    text: "Le scanner de pagne est incroyable ! Mes clients adorent découvrir l'histoire de leurs vêtements. Ça ajoute une dimension émotionnelle à mes créations.",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 4,
    name: "Ibrahim Traoré",
    role: "Artisan tisserand",
    location: "Bamako, Mali",
    avatar: "👨🏿‍🔧",
    rating: 5,
    text: "Grâce aux NFTs, mes créations sont maintenant protégées et je peux enfin être rémunéré équitablement pour mon savoir-faire ancestral.",
    color: "from-green-500 to-teal-500",
  },
];

function TestimonialCard({ 
  testimonial, 
  index 
}: { 
  testimonial: typeof testimonials[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="group relative"
    >
      <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-african transition-shadow duration-300 h-full">
        {/* Quote icon */}
        <div className={`absolute -top-4 -left-4 w-10 h-10 rounded-xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center shadow-lg`}>
          <Quote className="w-5 h-5 text-white" />
        </div>

        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </motion.div>
          ))}
        </div>

        {/* Text */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          "{testimonial.text}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="text-3xl">{testimonial.avatar}</div>
          <div>
            <div className="font-semibold text-gray-900">{testimonial.name}</div>
            <div className="text-sm text-gray-500">{testimonial.role}</div>
            <div className="text-xs text-gray-400">{testimonial.location}</div>
          </div>
        </div>

        {/* Hover gradient border */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm`} />
      </div>
    </motion.div>
  );
}

export function LandingTestimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section 
      ref={containerRef}
      className="py-20 md:py-32 bg-gradient-to-b from-white via-earth-50 to-white relative overflow-hidden"
    >
      {/* Background elements with parallax */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-primary-100/50 blur-3xl"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-20 -right-20 w-80 h-80 rounded-full bg-accent-gold/20 blur-3xl"
      />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6"
          >
            <span className="text-xl">💬</span>
            Ce qu'ils disent de nous
          </motion.div>

          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Témoignages de la{" "}
            <span className="text-gradient-african">Communauté</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez comment SANDJA transforme la relation des Africains avec leur patrimoine textile
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
              index={index}
            />
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { value: "4.9/5", label: "Note moyenne", icon: "⭐" },
            { value: "1,200+", label: "Avis positifs", icon: "💬" },
            { value: "98%", label: "Satisfaction", icon: "😊" },
            { value: "45", label: "Pays représentés", icon: "🌍" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
