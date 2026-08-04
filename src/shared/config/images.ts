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

  ABOUT_PASSION: `${CLOUDINARY_BASE}/v1781123573/Gosmel-cover.jpg`,
  ABOUT_DISCIPLINE: `${CLOUDINARY_BASE}/v1781123573/Gosmel-cover.jpg`,
  ABOUT_INNOVATION: `${CLOUDINARY_BASE}/v1781123573/Gosmel-cover.jpg`,

  WHY_GUITAR: `${CLOUDINARY_BASE}/v1785808073/Guitarra3_ddqqt8.png`,
  WHY_PIANO: `${CLOUDINARY_BASE}/a_90/v1785808073/Gosmel3_o0fase.png`,
} as const;

export type AppImageKey = keyof typeof AppImages;
