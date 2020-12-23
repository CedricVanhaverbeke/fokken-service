const numberToSymbolMapper = {
  11: "J",
  12: "Q",
  13: "K",
};

class Card {
  constructor(number, suit) {
    if (
      number === undefined ||
      suit === undefined ||
      number === null ||
      suit === null
    ) {
      throw new Error("number and suit should be defined");
    }

    if (number < 1 || number > 13) {
      throw new Error("Number should be between 1 and 13");
    }

    if (suit < 0 || suit > 3) {
      throw new Error("Suit must be an integer between 0 and 3");
    }

    this.number = numberToSymbolMapper[number] || number;
    this.suit = suit;
  }
}

export default Card;
