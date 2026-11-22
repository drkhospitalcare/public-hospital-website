import Link from "next/link";
import Image from "next/image";
import { Home, Stethoscope, Camera, Phone, ArrowRight, Compass } from "lucide-react";
import { HOSPITAL_INFO } from "@/lib/hospital-info";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl text-center">
        {/* Hospital Branding */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/drk-logo.png"
            alt="DRK Hospital"
            width={180}
            height={60}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>

        {/* 404 Eyebrow Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EFFBFC] px-3.5 py-1 text-xs font-bold text-[#087FBA] uppercase tracking-wider mb-4 border border-[#DCE8F0]">
          <Compass size={14} className="text-[#10C6C1]" />
          <span>Error 404 • Resource Not Located</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#071B68] tracking-tight">
          Page Not Found
        </h1>
        <p className="mt-4 text-sm sm:text-base text-[#5D6B85] leading-relaxed max-w-md mx-auto">
          The clinical department, medical service, or resource you are looking for may have been moved, updated, or is unavailable.
        </p>

        {/* Quick Navigation Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <Link
            href="/"
            className="p-4 rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] hover:bg-[#EFFBFC] hover:border-[#10C6C1] transition group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#071B68] border border-[#DCE8F0]">
                  <Home size={16} />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-[#071B68]">Homepage</h2>
                  <p className="text-[11px] text-[#5D6B85]">Main hospital portal</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-300 group-hover:text-[#087FBA] transition" />
            </div>
          </Link>

          <Link
            href="/services"
            className="p-4 rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] hover:bg-[#EFFBFC] hover:border-[#10C6C1] transition group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#087FBA] border border-[#DCE8F0]">
                  <Stethoscope size={16} />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-[#071B68]">Our Specialties</h2>
                  <p className="text-[11px] text-[#5D6B85]">Dental, Skin & Hair</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-300 group-hover:text-[#087FBA] transition" />
            </div>
          </Link>

          <Link
            href="/gallery"
            className="p-4 rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] hover:bg-[#EFFBFC] hover:border-[#10C6C1] transition group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#10C6C1] border border-[#DCE8F0]">
                  <Camera size={16} />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-[#071B68]">Visual Gallery</h2>
                  <p className="text-[11px] text-[#5D6B85]">Suites & infrastructure</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-300 group-hover:text-[#087FBA] transition" />
            </div>
          </Link>

          <Link
            href="/contact"
            className="p-4 rounded-2xl border border-[#DCE8F0] bg-[#F8FDFF] hover:bg-[#EFFBFC] hover:border-[#10C6C1] transition group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#071B68] border border-[#DCE8F0]">
                  <Phone size={16} />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-[#071B68]">Contact & Location</h2>
                  <p className="text-[11px] text-[#5D6B85]">Address & working hours</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-300 group-hover:text-[#087FBA] transition" />
            </div>
          </Link>
        </div>

        {/* Immediate Helpline Contact */}
        <div className="mt-8 pt-6 border-t border-[#DCE8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5D6B85]">
          <span>Need help finding a doctor or department?</span>
          <a
            href={`tel:${HOSPITAL_INFO.phone.primaryRaw}`}
            className="inline-flex items-center gap-1.5 font-bold text-[#071B68] hover:text-[#087FBA] transition"
          >
            <Phone size={13} className="text-[#10C6C1]" />
            <span>Call Reception ({HOSPITAL_INFO.phone.primary})</span>
          </a>
        </div>
      </div>
    </div>
  );
}

