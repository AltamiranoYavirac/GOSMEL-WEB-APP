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
        "/image/upload/q_auto,f_auto,w_1600/"
      ),
      width: 1600,
      height: 1067,
      alt: "GOSMEL Music Academy",
    })
  );
}
