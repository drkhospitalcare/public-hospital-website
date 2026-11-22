"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ApproachStepProps {
  step: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  delay?: number;
}

export default function ApproachStep({
  step,
  title,
  desc,
  icon: IconComponent,
  delay = 0,
}: ApproachStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className="card p-7 bg-white border border-[#DCE8F0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="inline-flex rounded-2xl bg-[#EAF8FA] p-3.5 text-[#087FBA]">
            <IconComponent size={24} />
          </div>
          <span className="text-2xl font-extrabold text-[#10C6C1]/70 font-mono tracking-tight">
            {step}
          </span>
        </div>
        <h3 className="text-lg font-bold text-[#071B68]">
          {title}
        </h3>
        <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#5D6B85]">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

