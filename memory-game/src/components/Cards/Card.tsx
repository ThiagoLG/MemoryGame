import { useState } from "react";
import { CardItem } from "../../model/card-item";
import "./Card.scss";

const Card = () => {

  /*--- General Variables and States ---*/
  const [flippedCard, setFlipCard] = useState(false);
  /*------------------------------------*/

  /*--- Functions ---*/
  let flipCard = () => {
    console.log(flippedCard);

    setFlipCard(current => !current);

    console.log('clicou');
  }
  /*-----------------*/


  /*--- Component Render ---*/
  return (
    <div className={'FlipperCard' + (flippedCard ? ' Flipped' : '')} onClick={flipCard}>
      <div className="Card Front"></div>
      <div className="Card Rear"></div>
    </div>
  )

}

export default Card;