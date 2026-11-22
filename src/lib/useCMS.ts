"use client";

import { useState, useEffect } from "react";
import { getPublishedSection } from "@/lib/cms";

/**
 * React Hook to subscribe to a published CMS section on the public website.
 * Always renders initially with the approved fallback so there is zero delay,
 * then seamlessly updates if live CMS published content exists in Supabase.
 */
export function useCMSSection<T>(sectionKey: string, fallback: T): T {
  const [data, setData] = useState<T>(fallback);

  useEffect(() => {
    let isMounted = true;
    getPublishedSection<T>(sectionKey, fallback).then((published) => {
      if (isMounted && published) {
        setData(published);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [sectionKey, fallback]);

  return data;
}

