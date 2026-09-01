export interface ICtaPanelLink {
  label: string;
  href: string;
}

export interface ICtaPanelProps {
  titleId: string;
  title: string;
  description: string;
  primary: ICtaPanelLink;
  secondary: ICtaPanelLink;
}
