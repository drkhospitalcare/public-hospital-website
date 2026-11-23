"use client";

import SafeImage from "@/components/SafeImage";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface FacilityCardProps {
  title: string;
  category: string;
  desc: string;
  image: string;
  delay?: number;
}

export default function FacilityCard({
  title,
  category,
  desc,
  image,
  delay = 0,
}: FacilityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className="card group overflow-hidden bg-white border border-[#DCE8F0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
    >
      {/* Facility Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <SafeImage
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-106"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          fallbackSrc="/images/infrastructure-reception.jpg"
        />
        <div className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#071B68] shadow-xs backdrop-blur-xs">
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-[#071B68] group-hover:text-[#087FBA] transition-colors">
            {title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[#5D6B85]">
            {desc}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#DCE8F0]">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087FBA] hover:text-[#071B68] transition"
          >
            <span>View in Gallery</span>
            <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

