import { useState } from "react";
import { CardItem } from "../../model/card-item";
import "./Card.scss";

const Card = (cardItem: CardItem) => {

  /*--- General Variables and States ---*/

  const [flippedCard, setFlipCard] = useState(false);

  /*------------------------------------*/




  /*--- Functions ---*/

  /**
   * Toggle card face
   * @returns void
   */
  let flipCard = () => setFlipCard(current => !current)

  /*-----------------*/





  /*--- Component Render ---*/
  return (
    <div className={'FlipperCard' + (flippedCard ? ' Flipped' : '')} onClick={flipCard}>
      <div
        className="Card Front"
        style={{ background: cardItem.contentImage }}>
      </div>

      <div className="Card Rear"
        style={{ background: cardItem.backgroundImage || cardItem.color }}>
      </div>
    </div>
  )

}

export default Card;