export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface Item {
  id: string;
  name: string;
  rank: number;
  imageUrl?: string;
}

export interface List {
  id: string;
  title: string;
  category: Category;
  items: Item[];
  createdAt: string;
  updatedAt: string;
}
