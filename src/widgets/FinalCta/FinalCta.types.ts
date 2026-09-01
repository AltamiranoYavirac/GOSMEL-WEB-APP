export interface IFinalCtaLink {
  label: string;
  href: string;
}

export interface IFinalCtaProps {
  image: string;
  imageAlt: string;
  titleId: string;
  title: string;
  description?: string;
  primary: IFinalCtaLink;
  secondary: IFinalCtaLink;
}
