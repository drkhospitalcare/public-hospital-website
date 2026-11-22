"use client";

import { LocationMapsContent } from "@/types/cms";
import { MapPin, ExternalLink, Navigation } from "lucide-react";

interface MapsEditorProps {
  maps: LocationMapsContent;
  setMaps: React.Dispatch<React.SetStateAction<LocationMapsContent>>;
}

export default function MapsEditor({ maps, setMaps }: MapsEditorProps) {
  return (
    <div className="card p-6 border border-[#DCE8F0] bg-white space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#071B68]">Google Maps & Location Management</h3>
        <p className="text-xs text-[#5D6B85]">
          Manage Google Maps embed URL, share link, geographic coordinates, and visitor directions.
        </p>
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

      <div>
        <label className="text-xs font-bold text-[#071B68]">Google Maps Embed URL</label>
        <input
          type="text"
          value={maps.embedUrl}
          onChange={(e) => setMaps({ ...maps, embedUrl: e.target.value })}
          placeholder="https://www.google.com/maps/embed?..."
          className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68] font-mono text-[11px]"
        />
        <p className="text-[11px] text-[#5D6B85] mt-1">
          Paste the embed URL extracted from Google Maps &gt; Share &gt; Embed a map.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-xs font-bold text-[#071B68]">Google Maps Share / Directions Link</label>
          <input
            type="text"
            value={maps.shareUrl}
            onChange={(e) => setMaps({ ...maps, shareUrl: e.target.value })}
            placeholder="https://maps.google.com/?q=..."
            className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs text-[#071B68]"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-[#071B68]">Latitude</label>
          <input
            type="text"
            value={maps.latitude}
            onChange={(e) => setMaps({ ...maps, latitude: e.target.value })}
            className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-mono text-[#071B68]"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-[#071B68]">Longitude</label>
          <input
            type="text"
            value={maps.longitude}
            onChange={(e) => setMaps({ ...maps, longitude: e.target.value })}
            className="mt-1 w-full rounded-xl border border-[#DCE8F0] bg-white px-3 py-2 text-xs font-mono text-[#071B68]"
          />
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

        {maps.embedUrl ? (
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
            />
          </div>
        ) : (
          <div className="p-8 text-center border-2 border-dashed border-[#DCE8F0] rounded-2xl text-slate-400 text-xs">
            Enter a Google Maps embed URL above to see the interactive preview.
          </div>
        )}
      </div>
    </div>
  );
}

