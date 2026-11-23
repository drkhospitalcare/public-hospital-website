import { CropCoordinates, CropExportOptions, ImageCropSettings } from "@/types/media-crop";

/**
 * Loads an HTMLImageElement from a URL or Blob with CORS enabled
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error("Failed to load image for cropping"));
    img.src = src;
  });
}

/**
 * Checks if a file or URL is a PNG asset that may require transparency preservation
 */
export function isPngAsset(urlOrName: string): boolean {
  return (
    urlOrName.toLowerCase().endsWith(".png") ||
    urlOrName.toLowerCase().includes("image/png") ||
    urlOrName.toLowerCase().includes("logo")
  );
}

/**
 * Executes high-precision canvas cropping with zoom, rotation, focal point, and format optimization
 */
export async function cropAndOptimizeImage(
  imageSource: string | HTMLImageElement,
  cropRect: CropCoordinates, // percentages 0-100 of natural dimensions
  settings: ImageCropSettings,
  options: CropExportOptions = {}
): Promise<{
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  mimeType: string;
}> {
  const img = typeof imageSource === "string" ? await loadImage(imageSource) : imageSource;

  const naturalWidth = img.naturalWidth || img.width;
  const naturalHeight = img.naturalHeight || img.height;

  // Calculate actual pixel coordinates of the crop rectangle
  let sx = Math.max(0, (cropRect.x / 100) * naturalWidth);
  let sy = Math.max(0, (cropRect.y / 100) * naturalHeight);
  let sWidth = Math.min(naturalWidth - sx, (cropRect.width / 100) * naturalWidth);
  let sHeight = Math.min(naturalHeight - sy, (cropRect.height / 100) * naturalHeight);

  // If cropRect is inverted or 0, fallback to full image
  if (sWidth <= 0 || sHeight <= 0) {
    sx = 0;
    sy = 0;
    sWidth = naturalWidth;
    sHeight = naturalHeight;
  }

  // Target output dimensions
  let targetWidth = Math.round(sWidth);
  let targetHeight = Math.round(sHeight);

  // Apply maximum dimension constraint if requested
  const maxDim = options.maxWidth || 1920;
  if (targetWidth > maxDim) {
    const ratio = maxDim / targetWidth;
    targetWidth = maxDim;
    targetHeight = Math.round(targetHeight * ratio);
  }

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (!ctx) {
    throw new Error("Unable to obtain 2D canvas context");
  }

  // Clean background or transparent canvas
  const isLogo = settings.presetKey === "logo" || (options.preserveTransparency && isPngAsset(img.src));
  if (!isLogo) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  } else {
    ctx.clearRect(0, 0, targetWidth, targetHeight);
  }

  // Enable high-quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Handle rotation if specified
  const rotation = (settings.rotation || 0) % 360;
  if (rotation !== 0) {
    ctx.save();
    ctx.translate(targetWidth / 2, targetHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    if (rotation === 90 || rotation === 270) {
      // Swap width/height for 90/270deg rotation
      ctx.drawImage(
        img,
        sx,
        sy,
        sWidth,
        sHeight,
        -targetHeight / 2,
        -targetWidth / 2,
        targetHeight,
        targetWidth
      );
    } else {
      ctx.drawImage(
        img,
        sx,
        sy,
        sWidth,
        sHeight,
        -targetWidth / 2,
        -targetHeight / 2,
        targetWidth,
        targetHeight
      );
    }
    ctx.restore();
  } else {
    // Normal draw
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
  }

  // Determine export MIME type
  let mimeType = "image/webp";
  if (isLogo) {
    mimeType = "image/png"; // Preserve PNG alpha transparency for logos
  } else if (options.format === "jpeg") {
    mimeType = "image/jpeg";
  } else if (options.format === "png") {
    mimeType = "image/png";
  }

  const quality = options.quality ?? 0.9;

  // Convert canvas to Blob & Data URL
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas toBlob failed"));
          return;
        }
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve({
          blob,
          dataUrl,
          width: targetWidth,
          height: targetHeight,
          mimeType,
        });
      },
      mimeType,
      quality
    );
  });
}

/**
 * Creates a File instance from a Blob for standard form upload
 */
export function createFileFromBlob(blob: Blob, originalName: string, suffix = "-cropped"): File {
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  const ext = blob.type === "image/png" ? "png" : blob.type === "image/jpeg" ? "jpg" : "webp";
  const newName = `${baseName}${suffix}.${ext}`;
  return new File([blob], newName, { type: blob.type, lastModified: Date.now() });
}

