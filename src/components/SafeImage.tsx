"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = "/images/hero-clinic.jpg";

export default function SafeImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  unoptimized,
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  const isBlob = typeof currentSrc === "string" && currentSrc.startsWith("blob:");

  return (
    <Image
      {...props}
      src={hasError ? fallbackSrc : currentSrc}
      alt={alt || "DRK Hospital Healthcare"}
      unoptimized={unoptimized || isBlob}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}

