"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

export interface SafeImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  fallbackSrc?: string;
  focalPoint?: { x: number; y: number };
  showSkeleton?: boolean;
}

const DEFAULT_FALLBACK = "/images/hero-clinic.jpg";

export default function SafeImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  unoptimized,
  className = "",
  style,
  focalPoint,
  priority = false,
  showSkeleton = true,
  ...props
}: SafeImageProps) {
  const resolvedInitialSrc = (src && typeof src === "string" && src.trim() !== "") ? src : fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState<string>(resolvedInitialSrc);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(Boolean(priority));

  useEffect(() => {
    const nextSrc = (src && typeof src === "string" && src.trim() !== "") ? src : fallbackSrc;
    setCurrentSrc(nextSrc);
    setHasError(false);
    if (priority) {
      setIsLoaded(true);
    }
  }, [src, fallbackSrc, priority]);

  const isBlob = typeof currentSrc === "string" && currentSrc.startsWith("blob:");
  const isSvg = typeof currentSrc === "string" && (currentSrc.toLowerCase().endsWith(".svg") || currentSrc.toLowerCase().includes(".svg"));

  // Compute focal point objectPosition if specified
  const objectPositionStyle = focalPoint
    ? { objectPosition: `${focalPoint.x}% ${focalPoint.y}%` }
    : {};

  const mergedStyle = {
    ...objectPositionStyle,
    ...style,
  };

  const finalSrc = hasError ? fallbackSrc : currentSrc;

  return (
    <>
      {showSkeleton && !isLoaded && !hasError && Boolean(props.fill) && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-slate-100/90 animate-pulse z-0 pointer-events-none rounded-[inherit]"
        />
      )}
      <Image
        {...props}
        src={finalSrc}
        alt={alt || "DRK Hospital Healthcare"}
        priority={priority}
        unoptimized={unoptimized || isBlob || isSvg}
        style={mergedStyle}
        className={`${className} transition-opacity duration-300 ${
          isLoaded || priority ? "opacity-100" : "opacity-0"
        }`}
        onLoad={(e) => {
          setIsLoaded(true);
          props.onLoad?.(e);
        }}
        onError={(e) => {
          if (!hasError) {
            setHasError(true);
            setCurrentSrc(fallbackSrc);
            setIsLoaded(true);
          }
          props.onError?.(e);
        }}
      />
    </>
  );
}
