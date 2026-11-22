"use client";

import { CheckCircle2 } from "lucide-react";

interface ServiceCardProps {
  title: string;
  desc: string;
  accentColor?: string;
}

export default function ServiceCard({
  title,
  desc,
  accentColor = "#087FBA",
}: ServiceCardProps) {
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
    </div>
  );
}

