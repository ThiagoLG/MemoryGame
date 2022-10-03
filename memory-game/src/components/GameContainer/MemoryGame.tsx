import { useEffect, useReducer, useState } from "react";
import { CardItem } from "../../model/card-item";
import './MemoryGame.scss';

import Card from "../Cards/Card";
import { GameOptionItem } from "../../model/game-option-item";

const MemoryGame = () => {

  /*--- General Variables and States ---*/
  const urlCards = './data/data.json';
  const initialGameOptions: GameOptionItem = {
    displayOptions: {
      gridColumns: 4,
      gridRows: 4,
      gap: '50px'
    }
  }

  const [cardsArray, setCardsArray] = useState<CardItem[]>([]);
  const [gameOptions, setOptions] = useState<GameOptionItem>(initialGameOptions);

  let styles = {

  }
  /*----------------------------*/



  /*--- Functions ---*/
  const getCardsFromApi = async () => {
    const cards = await (await fetch(urlCards)).json();
    setCardsArray(shuffleArray([...cards.data, ...cards.data]));
  }

  const shuffleArray = (array: CardItem[]) => {
    return array
      .map(item => ({ order: Math.random(), ...item }))
      .sort((a, b) => a.order - b.order)
  }

  const buildTemplateAreas = (cols: number, lines: number) => {
    let gridTemplate = '';
    for (let l = 0; l < lines; l++) {
      let currentCol = '';
      for (let c = 0; c < cols; c++) {
        currentCol += `c${c < cols - 1 ? ' ' : ''}`;
      }
      gridTemplate += `"${currentCol}"`;
    }

    return gridTemplate;
  }
  /*-----------------*/



  /*--- Initialization ---*/
  useEffect(() => {
    getCardsFromApi();
  }, [])
  /*----------------------*/




  /*--- Component Render ---*/
  return (
    <div className="GameContainer"
      style={{
        gridTemplateAreas: buildTemplateAreas(initialGameOptions.displayOptions.gridColumns, initialGameOptions.displayOptions.gridRows),
        gap: initialGameOptions.displayOptions.gap
      }}>
      {cardsArray.map((item) => <Card key={item.order} {...item} />)}
    </div>
  )
}

export default MemoryGame;