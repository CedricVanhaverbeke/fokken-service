import Deck from "./deck";

class Game {
  constructor(gameId, hostPlayer) {
    this.gameId = gameId;
    this.hostId = hostPlayer.id;
    this.deck = new Deck();
    this.players = [hostPlayer];
    this.turn = null;
  }

  getPlayer(playerId) {
    return this.players.find(({ id }) => playerId === id);
  }

  addPlayer(player) {
    if (!this.players.find(({ id }) => id === player.id)) {
      this.players = [...this.players, player];
    }
  }

  addCardToPlayer(playerId, card) {
    const indexToModify = this.players.findIndex(({ id }) => playerId === id);

    this.players[indexToModify].addCardToHand(card);
  }

  getPlayerOrder() {
    return this.players.map(
      ({ socket, hand, table, ...otherInfo }) => otherInfo
    );
  }

  // this function will return only the cards that can be seen by the player
  // We need to create an object that contains:
  // 1. All the cards of the current player
  // 2. The visible 3 cards on the table of each player
  // 3. The count of the cards in the hand of other players
  getPlayerView(playerId) {
    const otherPlayerCards = Object.fromEntries(
      this.players.map(({ hand, table, id }) => [id, { hand, table }])
    );

    return Object.fromEntries([
      ...Object.entries(otherPlayerCards).map(([id, { hand, table }]) => [
        id,
        {
          hand: id === playerId ? hand : hand.length,
          table:
            id === playerId
              ? table
              : table.map((stack) => [stack[0], undefined]),
        },
      ]),
    ]);
  }

  /**
   * Everybody starts off with 5 cards in his hand
   * and three stacks of two cards in front of him
   * All other cards are placed on a remaining stack in the middle of the board
   */
  divideCards() {
    // When the cards are divided a player needs to be randomly chosen to start
    this.turn = this.players[
      Math.floor(Math.random() * (this.players.length - 1))
    ].id;

    // When creating a deck, the cards are automaticlly shuffled
    // so, now we can just take 4 cards per player for the hands
    const hands = Object.fromEntries(
      this.players.map(({ id }) => [
        id,
        {
          hand: this.deck.popCards(4),
          table: Array.from(Array(3), () => this.deck.popCards(2)),
        },
      ])
    );

    // Now merge these hands with the players.
    this.players.forEach(({ id }, i) => {
      this.players[i].hand = hands[id].hand;
      this.players[i].table = hands[id].table;
    });

    return hands;
  }

  setNextTurn() {
    const newTurnIndex =
      (this.players.findIndex(({ id }) => this.turn === id) + 1) %
      this.players.length;

    this.turn = this.players[newTurnIndex].id;
    return this.players[newTurnIndex].id;
  }
}

export default Game;
