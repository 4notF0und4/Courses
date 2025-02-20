import { ReactNode } from "react";

export interface Course {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  categoryId: number;
  price: number;
  discount: number;
  isFree: boolean;
  coverFile: File | string | null;
  expireYear: number;
  expireMonth: number;
  expireDay: number;
  itemSpecifications: { value: string }[];
  coverImage?: string;
  rate?: ReactNode;
}
