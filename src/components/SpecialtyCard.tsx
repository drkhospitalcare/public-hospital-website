"use client";

import SafeImage from "@/components/SafeImage";
import Link from "next/link";
import { LucideIcon, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface SpecialtyCardProps {
  id: string;
  title: string;
  tagline: string;
  desc: string;
  icon: LucideIcon;
  image: string;
  features: string[];
  href: string;
  delay?: number;
}

export default function SpecialtyCard({
  title,
  tagline,
  desc,
  icon: IconComponent,
  image,
  features,
  href,
  delay = 0,
}: SpecialtyCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className="card flex flex-col overflow-hidden group bg-white border border-[#DCE8F0] shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Photograph Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <SafeImage
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fallbackSrc="/images/hero-clinic.jpg"
        />
        <div className="absolute top-4 right-4 rounded-xl bg-white/95 p-2.5 text-[#071B68] shadow-md backdrop-blur-xs">
          <IconComponent size={22} className="text-[#087FBA]" />
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col p-7">
        <span className="text-xs font-bold tracking-wider text-[#087FBA] uppercase">
          {tagline}
        </span>
        <h3 className="mt-1 text-2xl font-bold text-[#071B68]">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[#5D6B85] flex-1">
          {desc}
        </p>

        {/* Features Checklist */}
        <div className="mt-5 space-y-1.5 border-t border-[#DCE8F0] pt-4">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-xs font-semibold text-[#14234B]">
              <CheckCircle2 size={14} className="text-[#10C6C1] shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Learn More Action Link */}
        <div className="mt-6 pt-2">
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#087FBA] transition group-hover:text-[#071B68]"
          >
            <span>Learn More</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

