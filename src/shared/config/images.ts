const CLOUDINARY_BASE =
  "https://res.cloudinary.com/dv9lm0fnm/image/upload";

const CLOUDINARY_VIDEO_BASE =
  "https://res.cloudinary.com/dv9lm0fnm/video/upload";

export const AppImages = {
  HERO_COVER: `${CLOUDINARY_BASE}/v1781123573/Gosmel-cover.jpg`,

  LANDING_HERO_DESKTOP: `${CLOUDINARY_BASE}/ar_64:37,c_fill,g_auto,w_1920,q_auto,f_auto/v1786821231/Saludo_c6jxdq.png`,
  LANDING_HERO_MOBILE: `${CLOUDINARY_BASE}/ar_13:20,c_fill,g_auto,w_960,q_auto,f_auto/v1781128616/WhatsApp_Image_2026-06-10_at_01.11.01_z4qsil.jpg`,
  LANDING_STAGE: `${CLOUDINARY_BASE}/ar_3:2,c_fill,g_auto,w_1400,q_auto,f_auto/v1785808073/Guitarra3_ddqqt8.png`,
  LANDING_TEACHERS: `${CLOUDINARY_BASE}/ar_3:2,c_fill,g_auto,w_1400,q_auto,f_auto/v1786821231/Canto_3_h0dlse.png`,
  LANDING_PROGRAM_PIANO: `${CLOUDINARY_BASE}/ar_2:3,c_fill,g_auto,w_720,q_auto,f_auto/v1781128616/WhatsApp_Image_2026-06-10_at_01.10.52_w78mce.jpg`,
  LANDING_PROGRAM_VIOLIN: `${CLOUDINARY_BASE}/ar_2:3,c_fill,g_auto,w_720,q_auto,f_auto/v1781128616/WhatsApp_Image_2026-06-10_at_01.11.01_z4qsil.jpg`,
  LANDING_PROGRAM_GUITAR: `${CLOUDINARY_BASE}/ar_2:3,c_fill,g_auto,w_720,q_auto,f_auto/v1781128622/WhatsApp_Image_2026-06-10_at_01.23.13_ujavfi.jpg`,
  LANDING_PROGRAM_SOLFEO: `${CLOUDINARY_BASE}/ar_2:3,c_fill,g_auto,w_720,q_auto,f_auto/v1785808073/Gosmel3_o0fase.png`,
  LANDING_PROCESS: `${CLOUDINARY_BASE}/ar_9:10,c_fill,g_auto,w_1400,q_auto,f_auto/v1786821231/Violin_Guitarra_2_qfp5j8.png`,
  LANDING_CTA: `${CLOUDINARY_BASE}/ar_16:9,c_fill,g_south,w_1920,q_auto,f_auto/v1788565457/music-8559592_640_y9l2r8.jpg`,

  PAGE_HERO_COURSES: `${CLOUDINARY_BASE}/ar_16:9,c_fill,g_auto,w_1920,q_auto,f_auto/v1786821401/Piano3_ebisvx.png`,
  PAGE_HERO_ABOUT: `${CLOUDINARY_BASE}/ar_16:9,c_fill,g_auto,w_1920,q_auto,f_auto/v1786821231/panoramicasala_get7df.webp`,
  PAGE_HERO_CONTACT: `${CLOUDINARY_BASE}/ar_16:9,c_fill,g_auto,w_1920,q_auto,f_auto/v1788563954/ChatGPT_Image_4_sept_2026_18_19_06_s32a2z.png`,

  AUTH_LOGIN: `${CLOUDINARY_BASE}/ar_3:4,c_fill,g_auto,w_1200,q_auto,f_auto/v1788570489/retro-microphone-in-black-and-white-ecvl7feifzckcmlg_xo6s2s.jpg`,
  AUTH_REGISTER: `${CLOUDINARY_BASE}/ar_3:4,c_fill,g_auto,w_1200,q_auto,f_auto/v1788568993/photo-1670255022693-37f1be72bfcb_t4px3m.avif`,

  ABOUT_PASSION: `${CLOUDINARY_BASE}/q_auto,f_auto,w_600/v1788563482/8fbac9c764442353c285a941678a4fe4_imqlry.jpg`,
  ABOUT_DISCIPLINE: `${CLOUDINARY_BASE}/q_auto,f_auto,w_600/v1788564054/55571d9d43c41fd429e2cfde95d2d017_qtul9e.jpg`,
  ABOUT_INNOVATION: `${CLOUDINARY_BASE}/q_auto,f_auto,w_600/v1788454571/ChatGPT_Image_3_sept_2026_11_56_03_kyyvgm.png`,

  WHY_GUITAR: `${CLOUDINARY_BASE}/v1785808073/Guitarra3_ddqqt8.png`,
  WHY_PIANO: `${CLOUDINARY_BASE}/a_90/v1785808073/Gosmel3_o0fase.png`,

  COURSE_PIANO: `${CLOUDINARY_BASE}/q_auto,f_auto,w_1200/v1788564847/PianoSeñor_re9yyt.png`,
  COURSE_GUITAR: `${CLOUDINARY_BASE}/q_auto,f_auto,w_1200/v1786821546/Guitarras_k0vwdk.png`,
  COURSE_ELECTRIC_GUITAR: `${CLOUDINARY_BASE}/q_auto,f_auto,w_1200/v1788565356/GuitarraElectrica_vj8hdu.png`,
  COURSE_SOLFEO: `${CLOUDINARY_BASE}/q_auto,f_auto,w_1200/v1786821657/Solfeo_fbbxsf.png`,
  COURSE_VIOLIN: `${CLOUDINARY_BASE}/q_auto,f_auto,w_1200/v1781128620/WhatsApp_Image_2026-06-10_at_01.11.35_n1grr7.jpg`,
  COURSE_CHARANGO: `${CLOUDINARY_BASE}/q_auto,f_auto,w_1200/v1788564414/Charango_boliviano_q0os9f.jpg`,
  COURSE_QUENA: `${CLOUDINARY_BASE}/q_auto,f_auto,w_1200/v1788454496/ChatGPT_Image_3_sept_2026_11_54_42_eppbsc.png`,

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
