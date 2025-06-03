export interface CategoryCardProps {
  name: string;
  imageUrl: string;
  onPress: () => void;
  hasList?: boolean;
  width?: number;
  minHeight?: number;
  iconSize?: number;
  fontSize?: number;
}
