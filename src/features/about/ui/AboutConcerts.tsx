import { MediaFrame, SectionHeader } from "@/shared/ui";

import type { IAboutConcertsProps } from "./AboutConcerts.types";

export default function AboutConcerts({
  videoUrl,
  posterUrl,
  videoTitle,
  description,
}: IAboutConcertsProps) {
  return (
    <section className="w-full flex flex-col items-center gap-10">

      <SectionHeader
        eyebrow="Conciertos"
        title={videoTitle}
        description={description}
        size="lg"
        className="max-w-2xl"
      />

      <MediaFrame
        variant="video"
        src={videoUrl}
        poster={posterUrl}
        alt={videoTitle}
        aspect="video"
        className="w-full max-w-5xl"
      />

    </section>
  );
}
