/**
 * Centralized registry of static image assets hosted on Cloudinary.
 *
 * Usage:
 *   import { AppImages } from "@/shared/config/images";
 *   <Image src={AppImages.HERO_COVER} ... />
 *
 * To update an image, change only the URL here — no need to hunt
 * across components.
 */

const CLOUDINARY_BASE =
  "https://res.cloudinary.com/dv9lm0fnm/image/upload";

export const AppImages = {
  HERO_COVER: `${CLOUDINARY_BASE}/v1781123573/Gosmel-cover.jpg`,

} as const;

export type AppImageKey = keyof typeof AppImages;
