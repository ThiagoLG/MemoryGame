interface CardItem {
  id?: number;
  backgroundImage?: string;
  contentImage?: string;
  color?: string;
  order?: number;
  flipped?: boolean;
  correct?: boolean;
  key?: string;
}

export type { CardItem };
