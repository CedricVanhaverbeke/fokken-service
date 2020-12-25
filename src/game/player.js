class Player {
  constructor(userName, socket) {
    this.userName = userName;
    this.id = socket.id;
    this.socket = socket;
    this.hand = [];
    this.table = [];
  }

  addCardToHand(card) {
    this.hand = [...this.hand, card];
  }

  // Remove the card from somewhere
  // catch the error if there is no card in the hand
  removeCard(card) {
    let amountOfCardsRemoved = 0;
    try {
      this.removeCardFromHand(card);
      amountOfCardsRemoved++;
    } catch {}

    try {
      this.removeCardFromTable(card);
      amountOfCardsRemoved++;
    } catch {}

    if (amountOfCardsRemoved < 1) {
      throw new Error("Card was not found ine the player's cards");
    }

    if (amountOfCardsRemoved > 1) {
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
