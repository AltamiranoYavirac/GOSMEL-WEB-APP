import type { ReactNode } from "react";

export interface IAdminColumn<T> {
  key: string;
  label: string;
  headerClassName?: string;
  cellClassName?: string;
  render: (row: T) => ReactNode;
}

export interface IAdminDataTableFilter<T> {
  value: string;
  label: string;
  match: (row: T) => boolean;
}

export interface IAdminDataTableProps<T> {
  data: T[];
  columns: IAdminColumn<T>[];
  loading?: boolean;
  keyId: (row: T) => string;
  searchKeys?: Array<(row: T) => string>;
  searchPlaceholder?: string;
  filters?: IAdminDataTableFilter<T>[];
  emptyTitle?: string;
  emptyDescription?: string;
  rowActions?: (row: T) => ReactNode;
  countLabel?: string;
  pageSize?: number;
}