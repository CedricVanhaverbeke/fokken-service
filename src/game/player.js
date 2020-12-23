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
}

export default Player;
