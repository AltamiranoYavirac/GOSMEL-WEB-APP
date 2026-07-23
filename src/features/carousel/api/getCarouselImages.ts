import { cloudinary } from "@/shared/api/cloudinary";

export interface ICarouselImage {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  alt: string;
}

export async function getCarouselImages(): Promise<ICarouselImage[]> {
  const result = await cloudinary.search
    .expression("asset_folder=Carrousel")
    .sort_by("created_at", "asc")
    .max_results(20)
    .execute();

  return result.resources.map(
    (r: {
      public_id: string;
      secure_url: string;
      width: number;
      height: number;
    }) => ({
      publicId: r.public_id,
      secureUrl: r.secure_url.replace(
        "/image/upload/",
        "/image/upload/c_pad,b_auto:predominant,ar_16:9,w_1920,q_auto/"
      ),
      width: 1920,
      height: 1080,
      alt: "GOSMEL Music Academy",
    })
  );
}
