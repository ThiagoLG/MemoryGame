import { useEffect, useState } from "react";
import { CardItem } from "../../model/card-item";
import './MemoryGame.scss';

import Card from "../Cards/Card";

const MemoryGame = () => {

  /*--- General Variables and States ---*/
  const urlCards = './data/data.json';

  const [cardsArray, setCardsArray] = useState<CardItem[]>([]);
  /*----------------------------*/



  /*--- Functions ---*/
  const getCardsFromApi = async () => {
    const cards = await (await fetch(urlCards)).json();
    setCardsArray(cards.data);
  }
  /*-----------------*/



  /*--- Initialization ---*/
  useEffect(() => {
    getCardsFromApi();
  }, [])
  /*----------------------*/




  /*--- Component Render ---*/
  return (
    <div className="GameContainer">
      {cardsArray.map((item) => <Card key={item.id} {...item} />)}
    </div>
  )
}

export default MemoryGame;