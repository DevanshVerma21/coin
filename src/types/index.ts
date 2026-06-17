export type UserRole = "viewer" | "buyer" | "admin";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type ItemType = "coin" | "note";

export type RarityLevel = "R" | "RR" | "RRR" | "RRRR";

export interface IProvenanceEntry {
  period: string;
  description: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  type: ItemType;
  description?: string;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMediaAsset {
  _id: string;
  filename: string;
  originalName: string;
  url: string;
  gcsPath: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  uploadedBy: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IItem {
  _id: string;
  itemNumber: string;
  title: string;
  slug: string;
  type: ItemType;
  year: string;
  description: string;
  price: number;
  frontImage: string;
  backImage?: string;
  additionalImages?: string[];
  categories: string[];
  featured: boolean;
  featuredUntil?: Date;
  sold: boolean;
  views: number;
  // Archival / museum fields
  denomination?: string;
  composition?: string;
  weight?: string;
  mint?: string;
  diameter?: string;
  rarity?: RarityLevel;
  grade?: string;
  gradeType?: string;
  historicalContext?: string;
  provenance?: IProvenanceEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IItemPopulated extends Omit<IItem, "categories"> {
  categories: ICategory[];
}

export interface IInquiry {
  _id: string;
  itemId: string;
  itemTitle: string;
  itemNumber: string;
  userName?: string;
  userEmail?: string;
  message?: string;
  whatsappNumber: string;
  status: "pending" | "contacted" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface CatalogFilters {
  type?: ItemType;
  category?: string;
  year?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  sold?: boolean;
  search?: string;
  sort?: "price-asc" | "price-desc" | "year-asc" | "year-desc" | "newest" | "oldest";
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  totalItems: number;
  totalCoins: number;
  totalNotes: number;
  featuredItems: number;
  soldItems: number;
  totalCategories: number;
  totalMedia: number;
  totalInquiries: number;
  pendingInquiries: number;
  recentItems: IItem[];
  recentInquiries: IInquiry[];
}

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
