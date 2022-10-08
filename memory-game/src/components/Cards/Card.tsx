import { useEffect, useRef, useState } from "react";
import { CardComponent } from "../../model/card-component";
import { CardItem } from "../../model/card-item";
import "./Card.scss";

const Card = (props: CardComponent) => {

  /*--- General Variables and States ---*/

  const [flippedCard, setFlipCard] = useState(false);
  const itemRef = useRef();
  // const lastItemRef = useRef(null);
  const cardClass = `FlipperCard ${props.cardItem.flipped ? 'Flipped' : ''}`;
  console.log(cardClass);
  /*------------------------------------*/




  /*--- Functions ---*/

  /**
   * Toggle card face
   * @returns void
   */
  let flipCard = () => {

    props.callbackFunction(props.cardItem.id, itemRef);
    
    setFlipCard(props.cardItem.flipped);

  }

  /*-----------------*/



  /*--- Component Render ---*/
  return (
    <div ref={itemRef} className={cardClass} onClick={flipCard}>
      <div
        className="Card Front"
        style={{ background: props.cardItem.contentImage }}>
      </div>

      <div className="Card Rear"
        style={{ background: props.cardItem.backgroundImage || props.cardItem.color }}>
      </div>
    </div>
  )

}

export default Card;