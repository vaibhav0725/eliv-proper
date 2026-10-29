import { createOgImage, ogAlt, ogContentType, ogSize } from "@/lib/og-image";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;
export const runtime = "nodejs";

export default function OpenGraphImage() {
  return createOgImage();
}
