class Player {
  constructor(userName, socket) {
    this.userName = userName;
    this.id = socket.id;
    this.socket = socket;
    this.hand = [];
    this.table = [];
    this.isOut = false;
  }

  addCardsToHand(cards) {
    const newCards = Array.isArray(cards) ? cards : [cards];
    this.hand = [...this.hand, ...newCards];
  }

  hasNoCards() {
    return this.hand.length === 0 && this.table.flat().length === 0;
  }

  // Remove the card from somewhere
  // catch the error if there is no card in the hand
  removeCards(c) {
    const cards = Array.isArray(c) ? c : [c];
    let amountOfCardsRemoved = 0;

    cards.forEach((card) => {
      try {
        this.removeCardFromHand(card);
        amountOfCardsRemoved++;
      } catch {}
    });

    // If we are removing a card from the table, it will always
    // be a single card
    try {
      this.removeCardFromTable(cards[0]);
      amountOfCardsRemoved++;
    } catch {}

    if (amountOfCardsRemoved < cards.length) {
      throw new Error("Card was not found in the player's cards");
    }

    if (amountOfCardsRemoved > cards.length) {
      throw new Error("Card is both in player's hand and on table");
    }
  }

  removeCardFromHand(card) {
    const cardIndex = this.hand.findIndex(
      (handCard) =>
        handCard.number === card.number && handCard.suit === card.suit
    );

    if (cardIndex === -1) {
      throw new Error("Card not in hand");
    }

    this.hand.splice(cardIndex, 1);
  }

  removeCardFromTable(card) {
    for (let i = 0; i < 3; i++) {
      const cardIndex = this.table[i].findIndex(
        (handCard) =>
          handCard.number === card.number && handCard.suit === card.suit
      );

      if (cardIndex !== -1) {
        if (this.table[i].length === 1) {
          this.table[i] = [];
          return;
        }
        this.table[i].splice(cardIndex, 1);
        return;
      }
    }

    throw new Error("Card not in stack");
  }
}

export default Player;
