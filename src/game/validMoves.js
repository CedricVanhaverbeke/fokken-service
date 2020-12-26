// There are essentially two rules:
// Always play higher cards
// You can lay any number of cards you want.
// This function returns an array of the cards you can put on the stack. These cards will be enabled in your hand

// Function receives a card with a number. Only the number is important

const specialCards = [2, 7, 9, 10];
const HIGHEST_CARD = 13;

const symbolMapper = {
  J: 11,
  Q: 12,
  K: 13,
};

const numberMapper = {
  11: "J",
  12: "Q",
  13: "K",
};

const validMoves = ({ number }) => {
  const numberOrSymbol = symbolMapper[number] || number;

  return [
    ...new Set([
      ...Array.from(
        Array(HIGHEST_CARD - numberOrSymbol),
        (_, i) => numberMapper[i + 1 + numberOrSymbol] || i + 1 + numberOrSymbol
      ),
      ...specialCards,
    ]),
  ];
};

export default validMoves;
