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

const CLOUDINARY_VIDEO_BASE =
  "https://res.cloudinary.com/dv9lm0fnm/video/upload";

export const AppImages = {
  HERO_COVER: `${CLOUDINARY_BASE}/v1781123573/Gosmel-cover.jpg`,

  ABOUT_PASSION: `${CLOUDINARY_BASE}/q_auto,f_auto,w_600/v1786821231/Canto_3_h0dlse.png`,
  ABOUT_DISCIPLINE: `${CLOUDINARY_BASE}/q_auto,f_auto,w_600/v1786821231/Saludo_c6jxdq.png`,
  ABOUT_INNOVATION: `${CLOUDINARY_BASE}/q_auto,f_auto,w_600/v1786821231/Violin_Guitarra_2_qfp5j8.png`,

  WHY_GUITAR: `${CLOUDINARY_BASE}/v1785808073/Guitarra3_ddqqt8.png`,
  WHY_PIANO: `${CLOUDINARY_BASE}/a_90/v1785808073/Gosmel3_o0fase.png`,

  ABOUT_VIDEO: `${CLOUDINARY_VIDEO_BASE}/v1785810578/WhatsApp_Video_2026-06-08_at_21.12.29_ai0uyh.mp4`,
  ABOUT_VIDEO_PORTRAIT: `${CLOUDINARY_VIDEO_BASE}/v1785810504/WhatsApp_Video_2026-06-08_at_21.12.29_1_ks3fsd.mp4`,

  ABOUT_VIDEO_POSTER: `${CLOUDINARY_VIDEO_BASE}/so_2/v1785810578/WhatsApp_Video_2026-06-08_at_21.12.29_ai0uyh.jpg`,
  ABOUT_VIDEO_PORTRAIT_POSTER: `${CLOUDINARY_VIDEO_BASE}/so_2/v1785810504/WhatsApp_Video_2026-06-08_at_21.12.29_1_ks3fsd.jpg`,
} as const;

export const AppVideos = {
  ABOUT_INTRO: `${CLOUDINARY_VIDEO_BASE}/v1785810578/WhatsApp_Video_2026-06-08_at_21.12.29_ai0uyh.mp4`,
} as const;

export type AppImageKey = keyof typeof AppImages;
export type AppVideoKey = keyof typeof AppVideos;
