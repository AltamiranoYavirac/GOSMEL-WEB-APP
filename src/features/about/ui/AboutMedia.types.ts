export interface IAboutMediaProps {
  src: string;
  poster: string;
  title: string;
  aspect: "video" | "portrait";
  sizes: string;
  captionsSrc?: string;
  className?: string;
}
