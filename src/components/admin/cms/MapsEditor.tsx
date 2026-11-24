"use client";

import { useState } from "react";
import { LocationMapsContent } from "@/types/cms";
import { ExternalLink, AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";

interface MapsEditorProps {
  maps: LocationMapsContent;
  setMaps: React.Dispatch<React.SetStateAction<LocationMapsContent>>;
}

const OFFICIAL_EMBED_URL = "https://www.google.com/maps?q=13.1756454%2C79.6116292&z=17&output=embed";
const OFFICIAL_SHARE_URL = "https://www.google.com/maps/place/DRK+Dental+Skin+%26+Hair+Hospital+Private+Limited/@13.1756454,79.6090543,17z/data=!4m15!1m8!3m7!1s0x3a52a5e4f77fe909:0x7676cee213d6cd5d!2sDRK+Dental+Skin+%26+Hair+Hospital+Private+Limited!8m2!3d13.1756454!4d79.6116292!10e1!16s%2Fg%2F11p31pytyq!3m5!1s0x3a52a5e4f77fe909:0x7676cee213d6cd5d!8m2!3d13.1756454!4d79.6116292!16s%2Fg%2F11p31pytyq";
const OFFICIAL_LATITUDE = "13.1756454";
const OFFICIAL_LONGITUDE = "79.6116292";

export default function MapsEditor({ maps, setMaps }: MapsEditorProps) {
  const [previewError, setPreviewError] = useState(false);

  // Helper to extract src if the user pasted full <iframe> code
  const handleEmbedUrlChange = (rawInput: string) => {
    let clean = rawInput.trim();
    if (clean.includes("<iframe") && clean.includes("src=")) {
      const match = clean.match(/src=["']([^"']+)["']/);
      if (match && match[1]) {
        clean = match[1];
      }
    }
    setPreviewError(false);
    setMaps({ ...maps, embedUrl: clean });
  };

  const isShortenedUrl = maps.embedUrl?.includes("maps.app.goo.gl") || maps.embedUrl?.includes("goo.gl");

  return (
    <div className="card p-6 border border-[#DCE8F0] bg-white space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-[#071B68]">Google Maps & Location Management</h3>
          <p className="text-xs text-[#5D6B85]">
            Manage Google Maps embed URL, share link, geographic coordinates, and visitor directions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setMaps({
              ...maps,
              embedUrl: OFFICIAL_EMBED_URL,
              shareUrl: OFFICIAL_SHARE_URL,
              latitude: OFFICIAL_LATITUDE,
              longitude: OFFICIAL_LONGITUDE,
            });
            setPreviewError(false);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#087FBA]/30 bg-[#EFFBFC] text-[#087FBA] text-xs font-semibold hover:bg-[#087FBA] hover:text-white transition cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw size={12} />
          <span>Reset to Official Coordinates & Links</span>
        </button>
      </div>

      {/* Enable toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="mapToggle"
          checked={maps.isMapEnabled}
          onChange={(e) => setMaps({ ...maps, isMapEnabled: e.target.checked })}
          className="h-4 w-4 rounded border-slate-300 text-[#087FBA]"
        />
        <label htmlFor="mapToggle" className="text-xs font-bold text-[#071B68] cursor-pointer">
          Enable Google Maps interactive frame on the public Contact page
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-bold text-[#071B68]">Map Display Title</label>
          <input
            type="text"
            value={maps.mapTitle}
            onChange={(e) => setMaps({ ...maps, mapTitle: e.target.value })}
            className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-[#071B68]">Directions Button Text</label>
          <input
            type="text"
            value={maps.directionsButtonText}
            onChange={(e) => setMaps({ ...maps, directionsButtonText: e.target.value })}
            className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-[#071B68]">Map Section Description</label>
        <textarea
          rows={2}
          value={maps.mapDescription}
          onChange={(e) => setMaps({ ...maps, mapDescription: e.target.value })}
          className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white p-2.5 text-xs text-[#071B68]"
        />
      </div>

      {/* Google Maps Embed URL Field */}
      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#071B68]">Google Maps Embed URL</label>
          {isShortenedUrl && (
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Shortened URL Detected
            </span>
          )}
        </div>
        <input
          type="text"
          value={maps.embedUrl}
          onChange={(e) => handleEmbedUrlChange(e.target.value)}
          placeholder="https://www.google.com/maps?q=13.1756454%2C79.6116292&z=17&output=embed"
          className={`mt-1 w-full rounded-xl border px-3 py-2 text-xs text-[#071B68] font-mono text-[11px] ${
            isShortenedUrl ? "border-amber-400 bg-amber-50/30" : "border-[#DCE8F0] bg-white"
          }`}
        />

        {isShortenedUrl ? (
          <div className="mt-2 p-3 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-900 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle size={14} className="text-amber-600 shrink-0" />
              <span>Shortened links (maps.app.goo.gl) cannot be embedded in an iframe.</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Google Maps blocks shortened links inside iframes with same-origin security policies. Use the standard coordinates embed URL instead.
            </p>
            <button
              type="button"
              onClick={() => {
                setMaps({ ...maps, embedUrl: OFFICIAL_EMBED_URL });
                setPreviewError(false);
              }}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
            >
              <CheckCircle2 size={12} className="text-emerald-600" />
              <span>Click here to use recommended embed URL: {OFFICIAL_EMBED_URL}</span>
            </button>
          </div>
        ) : (
          <p className="text-[11px] text-[#5D6B85] mt-1">
            Must be a valid embed URL (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">{OFFICIAL_EMBED_URL}</code>) or pasted from Google Maps &gt; Share &gt; Embed a map.
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-xs font-bold text-[#071B68]">Google Maps Share / Directions Link</label>
          <input
            type="text"
            value={maps.shareUrl}
            onChange={(e) => setMaps({ ...maps, shareUrl: e.target.value })}
            placeholder="https://www.google.com/maps/place/..."
            className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
          />
          <p className="text-[10px] text-[#5D6B85] mt-1">
            Opens the official DRK Dental Skin &amp; Hair Hospital listing in full Google Maps.
          </p>
        </div>
        <div>
          <label className="text-xs font-bold text-[#071B68]">Latitude (Hospital Business Pin)</label>
          <input
            type="text"
            value={maps.latitude}
            onChange={(e) => setMaps({ ...maps, latitude: e.target.value })}
            placeholder="13.1756454"
            className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-mono text-[#071B68]"
          />
          <p className="text-[10px] text-[#5D6B85] mt-1">
            Confirmed: 13.1756454
          </p>
        </div>
        <div>
          <label className="text-xs font-bold text-[#071B68]">Longitude (Hospital Business Pin)</label>
          <input
            type="text"
            value={maps.longitude}
            onChange={(e) => setMaps({ ...maps, longitude: e.target.value })}
            placeholder="79.6116292"
            className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-mono text-[#071B68]"
          />
          <p className="text-[10px] text-[#5D6B85] mt-1">
            Confirmed: 79.6116292
          </p>
        </div>
      </div>

      {/* Live Map Preview inside the Admin Portal */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#071B68]">
            Interactive Map Preview
          </label>
          {maps.shareUrl && (
            <a
              href={maps.shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#087FBA] hover:underline"
            >
              <span>Test External Link</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        {isShortenedUrl ? (
          <div className="p-8 text-center border-2 border-dashed border-amber-300 rounded-2xl bg-amber-50/50 text-amber-800 text-xs space-y-2">
            <AlertTriangle className="mx-auto text-amber-600" size={24} />
            <p className="font-bold">Cannot Preview Shortened URL in iframe</p>
            <p className="text-[11px] text-amber-700 max-w-md mx-auto">
              Please replace the shortened URL with the standard embed URL to view the interactive map preview.
            </p>
            <button
              type="button"
              onClick={() => {
                setMaps({ ...maps, embedUrl: OFFICIAL_EMBED_URL });
                setPreviewError(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition cursor-pointer"
            >
              Use Standard Embed URL
            </button>
          </div>
        ) : maps.embedUrl && !previewError ? (
          <div className="overflow-hidden rounded-2xl border border-[#DCE8F0] bg-slate-100 shadow-sm aspect-[16/9] sm:aspect-[21/9] w-full">
            <iframe
              src={maps.embedUrl}
              title={maps.mapTitle || "Google Map Preview"}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onError={() => setPreviewError(true)}
            />
          </div>
        ) : (
          <div className="p-8 text-center border-2 border-dashed border-[#DCE8F0] rounded-2xl text-slate-400 text-xs space-y-2">
            <p>
              {previewError
                ? "The map preview could not be loaded. Please verify your embed URL format or test the external link."
                : "Enter a Google Maps embed URL above to see the interactive preview."}
            </p>
            {previewError && (
              <button
                type="button"
                onClick={() => {
                  setMaps({ ...maps, embedUrl: OFFICIAL_EMBED_URL });
                  setPreviewError(false);
                }}
                className="text-xs text-[#087FBA] font-bold underline cursor-pointer"
              >
                Reset to recommended embed URL
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
