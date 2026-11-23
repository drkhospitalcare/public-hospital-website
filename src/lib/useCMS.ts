"use client";

import { useState, useEffect } from "react";
import { getPublishedSection } from "@/lib/cms";
import { useCMSContext } from "@/components/cms/CMSProvider";

/**
 * React Hook to subscribe to a published CMS section on the public website.
 * Priority order for initial render:
 * 1. initialData (passed explicitly by the caller)
 * 2. Preloaded server data from CMSContext (eliminates hydration flash!)
 * 3. Approved fallback default
 *
 * It maintains client-side freshness in the background without layout shifts or flashing.
 */
export function useCMSSection<T>(
  sectionKey: string,
  fallback: T,
  initialData?: T
): T {
  const contextSections = useCMSContext();
  const preloaded = (initialData ?? (contextSections[sectionKey] as T | undefined)) ?? fallback;

  const [data, setData] = useState<T>(preloaded);

  // Sync if context updates (e.g. during client-side navigation)
  useEffect(() => {
    if (contextSections[sectionKey]) {
      setData(contextSections[sectionKey] as T);
    }
  }, [contextSections, sectionKey]);

  useEffect(() => {
    let isMounted = true;
    getPublishedSection<T>(sectionKey, fallback).then((published) => {
      if (isMounted && published) {
        setData((prev) => {
          try {
            if (JSON.stringify(prev) === JSON.stringify(published)) {
              return prev;
            }
          } catch {
            // fallback if not serializable
          }
          return published;
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, [sectionKey, fallback]);

  return data;
}
