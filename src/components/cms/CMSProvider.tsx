"use client";

import React, { createContext, useContext, useMemo } from "react";

type CMSSectionsMap = Record<string, unknown>;

const CMSContext = createContext<CMSSectionsMap>({});

export interface CMSProviderProps {
  initialSections?: CMSSectionsMap;
  children: React.ReactNode;
}

/**
 * Global CMS Provider that seeds client components with server-preloaded
 * published section content, eliminating default-image flashing and layout shifts.
 */
export function CMSProvider({
  initialSections = {},
  children,
}: CMSProviderProps) {
  const value = useMemo(() => initialSections, [initialSections]);

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}

export function useCMSContext(): CMSSectionsMap {
  return useContext(CMSContext);
}

