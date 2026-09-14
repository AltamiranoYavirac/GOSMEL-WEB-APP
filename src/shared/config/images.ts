const CLOUDINARY_BASE = "https://res.cloudinary.com/dv9lm0fnm/image/upload";
const CLOUDINARY_VIDEO_BASE = "https://res.cloudinary.com/dv9lm0fnm/video/upload";

export const AppImages = {
  AUTH_LOGIN: `${CLOUDINARY_BASE}/ar_3:4,c_fill,g_auto,w_1200,q_auto,f_auto/v1789077728/MicrofonoLight_tudvss.png`,
  AUTH_REGISTER: `${CLOUDINARY_BASE}/ar_3:4,c_fill,g_auto,w_1200,q_auto,f_auto/v1789077062/Piano5Light_hqrabp.png`,
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
