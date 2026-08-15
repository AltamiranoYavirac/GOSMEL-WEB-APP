export interface IDashboardCourse {
  id: string;
  title: string;
  teacher: string;
  instrument: string;
  nextClass: string;
  schedule: string;
  status: "activo" | "pausado" | "completado";
  imageUrl: string;
  joinHref: string;
}

export interface IDashboardResource {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface IDashboardTip {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface IDashboardEvent {
  id: string;
  date: string;
  title: string;
  location: string;
}

export interface IDashboardRecommended {
  id: string;
  title: string;
  schedule: string;
  imageUrl: string;
  enrollHref: string;
}