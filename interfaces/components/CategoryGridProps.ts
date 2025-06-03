import type { Category, List } from '@/interfaces/services/lists';

export interface CategoryGridProps {
  categories: Category[];
  lists: List[];
  search?: string;
  onCategoryPress?: (cat: Category) => void;
}
