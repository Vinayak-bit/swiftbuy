export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bg: string;
}

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice: number;
  categoryId: string;
  rating: number;
  reviewCount: number;
  stock: number;
  badge?: string;
  isFeatured?: boolean;
  isDeal?: boolean;
  tags?: string[];
}

export interface HeroBannerSlide {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  colors: readonly [string, string];
  iconName: string;
  tag: string;
}
