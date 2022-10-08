import React, { useEffect, useReducer, useRef, useState } from "react";
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
  const CARDS_ID_GAP = 1000;
  const UNFLIP_CARD_DELAY = 1 * 1000; // 1 second to unflip

  const [cardsArray, setCardsArray] = useState<CardItem[]>([]);
  const [gameOptions, setOptions] = useState<GameOptionItem>(initialGameOptions);

  let previousSelectedCard: number = null;
  let previousCardElement: any = null;

  const first = useRef<CardItem | null>(null);
  const second = useRef<CardItem | null>(null);
  const unflip = useRef(false);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);


  /*----------------------------*/



  /*--- Functions ---*/
  const getCardsFromApi = async () => {
    const CARDS_RESULT = await (await fetch(urlCards)).json();
    const CARDS_ARRAY: CardItem[] = CARDS_RESULT.data;
    let clonedCards: CardItem[] = CARDS_ARRAY.map(c => ({ ...c, id: c.id + CARDS_ID_GAP }));

    setCardsArray(shuffleArray([...CARDS_ARRAY, ...clonedCards]));
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

  const verifyEqualCards = (first: number, second: number) => {
    if (first < CARDS_ID_GAP) return first === (second - CARDS_ID_GAP);
    else return (first - CARDS_ID_GAP) === second;
  }

  const clickCard = (cardId: number, cardRef: any) => {
    console.log('callback');

    let updatedArray: CardItem[] = cardsArray;
    let isCorrect = previousSelectedCard && verifyEqualCards(previousSelectedCard, cardId);

    updatedArray.forEach(card => {
      //Set correct flag
      if (isCorrect && (card.id === previousSelectedCard || card.id === cardId))
        card.correct = true;

      //Set flip flag
      if (card.id === cardId && !card.flipped) {
        card.flipped = true;
      }
    });

    //Unflip last cards if incorrect
    if (!isCorrect && previousSelectedCard) {
      updatedArray.forEach(card => card.flipped = !!card.correct) //set flipped props
      setTimeout(() => {
        console.log('unflip');
        previousCardElement.current.click();
        cardRef.current.click();
        previousCardElement = null;
      }, UNFLIP_CARD_DELAY);//trigger click on cards to unflip
    }

    setCardsArray(updatedArray);

    //set last card selected
    if (!previousSelectedCard) {
      previousSelectedCard = cardId;
      previousCardElement = cardRef;
    }
    else {
      previousSelectedCard = null;
    }
  }

  const handleCard = (id: number) => {

    const newStateCards = cardsArray.map((card) => {
      // Se o id do cartão não for o id clicado, não faz nada
      if (card.id !== id) return card;

      // Se o cartão já estiver virado, não faz nada
      if (card.flipped) return card;

      // Desviro possíveis cartas erradas
      if (unflip.current && first.current && second.current) {
        first.current.flipped = false;
        second.current.flipped = false;
        first.current = null;
        second.current = null;
        unflip.current = false;
      }

      // Virar o card
      card.flipped = true;

      // Configura primeiro e segundo cartão clicados
      if (first.current === null) {
        first.current = card;
      } else if (second.current === null) {
        second.current = card;
      }

      // Se eu tenho os dois cartão virados
      // Posso checar se estão corretos
      if (first.current && second.current) {
        if (verifyEqualCards(first.current.id, second.current.id)) {
          // A pessoa acertou
          first.current = null;
          second.current = null;
          setMatches((m) => m + 1);
        } else {
          // A pessoa errou
          unflip.current = true;
        }

        setMoves((m) => m + 1);
      }

      return card;
    });

    setCardsArray(newStateCards);

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
      {cardsArray.map((item) =>
        <Card
          key={item.id}
          cardItem={item}
          callbackFunction={handleCard}
          previousCardId={previousSelectedCard}
        />
      )}
    </div>
  )
}

export default MemoryGame;