import Card from "./card";

class Deck {
  constructor() {
    const cards = Array.from(Array(4), (_, suit) => [
      ...Array.from(Array(13), (_, number) => new Card(number + 1, suit)),
    ]).flat();

    this.cards = this.shuffle(cards);
  }

  // Fisher yates shuffle as found on https://bost.ocks.org/mike/shuffle/
  shuffle(array) {
    var m = array.length,
      t,
      i;

    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }

  size() {
    return this.cards.length;
  }

  popCards(amount) {
    if (amount === 1) {
      return this.cards.shift();
    }

    return this.cards.splice(0, amount);
  }
}

export default Deck;
