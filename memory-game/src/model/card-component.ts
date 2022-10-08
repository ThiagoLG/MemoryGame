import { CardItem } from "./card-item";

interface CardComponent {
  cardItem: CardItem;
  callbackFunction: Function;
  previousCardId: number;
}

export type { CardComponent }