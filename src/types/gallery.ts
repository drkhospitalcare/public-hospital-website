export type GalleryCategory =
  | "Dental Care"
  | "Skin Care"
  | "Hair Care"
  | "Hospital Infrastructure"
  | "Hospital Activities";

export type GalleryImage = {
  id: string;
  title: string;
  caption?: string | null;
  category: GalleryCategory;
  storage_path: string;
  public_url: string;
  is_published?: boolean;
  created_at: string;
  updated_at?: string;
};
