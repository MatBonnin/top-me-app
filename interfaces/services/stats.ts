export interface CategoryStat {
  id: string;
  categoryId?: string;
  name: string;
  imageUrl?: string;
  count: number; // nombre de listes remplies par l'utilisateur
}

export interface ItemStat {
  id: string;
  categoryId: string;
  item: string;
  score: number;
  appearances: number;
  updatedAt: string;
}
