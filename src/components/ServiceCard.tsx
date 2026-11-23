"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight, MessageSquareText } from "lucide-react";

interface ServiceCardProps {
  title: string;
  desc: string;
  accentColor?: string;
  slug?: string;
  specialtyId?: string;
  detailHref?: string;
}

export default function ServiceCard({
  title,
  desc,
  accentColor = "#087FBA",
  slug,
  specialtyId,
  detailHref,
}: ServiceCardProps) {
  const resolvedDetailHref = detailHref || (specialtyId && slug ? `/services/${specialtyId}/${slug}` : undefined);

  return (
    <div className="card p-6 flex flex-col justify-between border border-[#DCE8F0] bg-white hover:border-[#087FBA] hover:shadow-md transition-all">
      <div>
        <div className="flex items-start gap-3 mb-3">
          <div
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EFFBFC]"
            style={{ color: accentColor }}
          >
            <CheckCircle2 size={16} />
          </div>
          <h3 className="text-base font-bold text-[#071B68] leading-snug">{title}</h3>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-[#5D6B85] pl-8">
          {desc}
        </p>
      </div>

      <div className="mt-5 pt-3.5 border-t border-[#DCE8F0]/80 pl-8 flex items-center justify-between gap-3 text-xs">
        {resolvedDetailHref ? (
          <Link
            href={resolvedDetailHref}
            className="font-bold text-[#087FBA] hover:text-[#071B68] inline-flex items-center gap-1 transition"
          >
            <span>Learn More</span>
            <ArrowRight size={13} />
          </Link>
        ) : (
          <span className="text-slate-400 font-medium">In-Clinic Procedure</span>
        )}

        <Link
          href="/contact"
          className="text-[#5D6B85] hover:text-[#071B68] font-semibold inline-flex items-center gap-1 transition"
        >
          <MessageSquareText size={13} />
          <span>Enquire</span>
        </Link>
      </div>
    </div>
  );
}

