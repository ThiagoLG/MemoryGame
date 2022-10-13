import { useEffect, useRef, useState } from "react";
import { CardItem } from "../../model/card-item";
import { GameOptionItem } from "../../model/game-option-item";
import Card from "../Cards/Card";
import './MemoryGame.scss';

const MemoryGame = () => {

  /*--- General Variables and States ---*/
  /*- Props -*/
  const URL_API_CARDS = './data/data.json'; // url to search cards options
  const CARDS_ID_GAP = 1000; // Gap between cards ID (used to verify pairs)
  const UNFLIP_CARD_DELAY = 1 * 1000; // 1 second to unflip
  const INITIAL_GAME_OPTIONS: GameOptionItem = {
    displayOptions: {
      gridColumns: 4,
      gridRows: 4,
      gap: '50px'
    }
  }

  /*- States -*/
  const [gameOptions, setGameOptions] = useState<GameOptionItem>(INITIAL_GAME_OPTIONS);
  const [cardsArray, setCardsArray] = useState<CardItem[]>([]); //Array of cards state
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);

  /*- Refs -*/
  const first = useRef<CardItem | null>(null);
  const second = useRef<CardItem | null>(null);
  const unflip = useRef(false);
  /*----------------------------*/



  /*--- Functions ---*/
  /**
   * Function responsible for getting all cards from the API
   */
  const getCardsFromApi = async () => {
    // Get all cards from URL_API_CARDS
    const CARDS_RESULT = await (await fetch(URL_API_CARDS)).json();
    // Get array from result to const
    const CARDS_ARRAY: CardItem[] = CARDS_RESULT.data;
    // Clone cards based on original array and increase ID from "CARDS_ID_GAP" const
    let clonedCards: CardItem[] = CARDS_ARRAY.map(c => ({ ...c, id: c.id + CARDS_ID_GAP }));

    setCardsArray(shuffleArray([...CARDS_ARRAY, ...clonedCards]));
  }

  /**
   * Function responsible for shuffle array items to show randomly on the page
   * @param array Array of cards to shuffle
   * @returns scrambled array
   */
  const shuffleArray = (array: CardItem[]) => {
    return array
      .map(item => ({ order: Math.random(), ...item }))
      .sort((a, b) => a.order - b.order)
  }

  /**
   * Function responsible for build Template Area props to use in container grid style
   * @param cols Number of columns to build template
   * @param lines Number of lines to build template
   * @returns String contains template areas
   */
  const buildTemplateAreas = (cols: number, lines: number): string => {
    let gridTemplate = '';
    for (let l = 0; l < lines; l++) {
      let currentCol = '';
      for (let c = 0; c < cols; c++) {
        currentCol += `c${c < cols - 1 ? ' ' : ''}`;
      }
      gridTemplate += `"${currentCol}"`;
    }

    //Alterar a logica acima para utilizar o trecho abaixo:
    // let template = new Array(lines).fill(new Array(cols).fill('c').join(''));
    // template.join(' ')

    return gridTemplate;
  }

  const verifyEqualCards = (first: number, second: number) => {
    if (first < CARDS_ID_GAP) return first === (second - CARDS_ID_GAP);
    else return (first - CARDS_ID_GAP) === second;
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
        gridTemplateAreas: buildTemplateAreas(INITIAL_GAME_OPTIONS.displayOptions.gridColumns, INITIAL_GAME_OPTIONS.displayOptions.gridRows),
        gap: INITIAL_GAME_OPTIONS.displayOptions.gap
      }}>
      {cardsArray.map((item) =>
        <Card
          key={item.id}
          cardItem={item}
          callbackFunction={handleCard}
        />
      )}
    </div>
  )
}

export default MemoryGame;