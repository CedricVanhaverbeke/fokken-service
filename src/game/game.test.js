import Game from "./game";
import Player from "./player";

const isCard = (card) => {
  return (
    !!card &&
    card.number !== undefined &&
    card.suit !== undefined &&
    card.number !== null &&
    card.suit !== null
  );
};

describe("game", () => {
  const mockHostPlayer = new Player(`host_player`, { id: "host_id" });
  const mockGameId = "123";
  const mockPlayers = Array.from(
    Array(3),
    (_, i) => new Player(`player${i}`, { id: `id_${i}` })
  );
  let mockGame;

  beforeEach(() => {
    mockGame = new Game(mockGameId, mockHostPlayer);
    mockPlayers.forEach((player) => {
      mockGame.addPlayer(player);
    });
  });

  it("should create a game", () => {
    // deck is random
    const { deck, ...otherGameInfo } = mockGame;
    expect(otherGameInfo).toMatchInlineSnapshot(`
      Object {
        "gameId": "123",
        "hostId": "host_id",
        "playedCards": Array [],
        "players": Array [
          Player {
            "hand": Array [],
            "id": "host_id",
            "socket": Object {
              "id": "host_id",
            },
            "table": Array [],
            "userName": "host_player",
          },
          Player {
            "hand": Array [],
            "id": "id_0",
            "socket": Object {
              "id": "id_0",
            },
            "table": Array [],
            "userName": "player0",
          },
          Player {
            "hand": Array [],
            "id": "id_1",
            "socket": Object {
              "id": "id_1",
            },
            "table": Array [],
            "userName": "player1",
          },
          Player {
            "hand": Array [],
            "id": "id_2",
            "socket": Object {
              "id": "id_2",
            },
            "table": Array [],
            "userName": "player2",
          },
        ],
        "turn": null,
      }
    `);
  });

  describe("Add card to played cards", () => {
    it("should add one card", () => {
      expect(mockGame.playedCards).toHaveLength(0);

      mockGame.addCardsToPlayedCards({ number: 1, suit: 0 });
      expect(mockGame.playedCards).toHaveLength(1);
    });

    it("should add multiple cards", () => {
      expect(mockGame.playedCards).toHaveLength(0);

      mockGame.addCardsToPlayedCards([
        { number: 1, suit: 0 },
        { number: 1, suit: 1 },
      ]);
      expect(mockGame.playedCards).toHaveLength(2);
    });
  });

  describe("Add card to player", () => {
    it("should add a card to the player", () => {
      const referenceId = mockHostPlayer.id;
      mockGame.divideCards();

      const prevHand = mockGame.getPlayer(referenceId).hand.length;
      const prevTable = mockGame.getPlayer(referenceId).table.flat().length;
      mockGame.addCardToPlayer(referenceId, { number: 1, suit: 1 });

      expect(mockGame.getPlayer(referenceId).hand.length).toEqual(prevHand + 1);
      expect(mockGame.getPlayer(referenceId).table.flat().length).toEqual(
        prevTable
      );
    });
  });

  describe("divideCards", () => {
    it("should divide the cards correctly", () => {
      const cards = mockGame.divideCards();

      // amount of players + host
      expect(Object.keys(cards).length === mockPlayers.length + 1);

      Object.entries(cards).forEach(([id, playerCards]) => {
        expect(playerCards["hand"]).toBeDefined();
        expect(playerCards["table"]).toBeDefined();

        // Check if hand and table have the right amount of cards
        expect(playerCards["hand"]).toHaveLength(4);
        expect(playerCards["table"]).toHaveLength(3);
      });
    });
  });

  describe("getPlayerView", () => {
    it("should show cards of own player in his hand", () => {
      const referenceId = mockHostPlayer.id;
      const cards = mockGame.getPlayerView(referenceId);

      expect(Array.isArray(cards[referenceId].hand)).toBeTruthy();

      cards[referenceId].hand.forEach((card) => {
        expect(isCard(card)).toBeTruthy();
      });

      cards[referenceId].table.forEach((tableStack) => {
        tableStack.forEach((card) => {
          expect(isCard(card)).toBeTruthy();
        });
      });
    });

    it("should show cards of own player in his hand", () => {
      const referenceId = mockHostPlayer.id;
      const cards = mockGame.getPlayerView(referenceId);

      expect(Array.isArray(cards[referenceId].hand)).toBeTruthy();

      cards[referenceId].hand.forEach((card) => {
        expect(isCard).toBeTruthy();
      });
    });

    it("should hide the cards of other players", () => {
      const referenceId = mockHostPlayer.id;
      const cards = mockGame.getPlayerView(referenceId);

      mockPlayers.forEach(({ id: playerId }) => {
        expect(cards).toHaveProperty(playerId);
        expect(cards[playerId]).toHaveProperty("hand");
        expect(cards[playerId]).toHaveProperty("table");

        expect(Array.isArray(cards[playerId].hand)).toBeFalsy();
        expect(cards[playerId].hand).toBe(4);

        expect(Array.isArray(cards[playerId].table)).toBeTruthy();

        isCard(
          cards[playerId].table.forEach(([firstCard, hiddenCard]) => {
            expect(isCard(firstCard)).toBeTruthy();
            expect(isCard(hiddenCard)).toBeFalsy();
          })
        );
      });
    });

    describe("nextTurn", () => {
      it("Should start on a turn", () => {
        expect(mockGame.turn).toBeNull();
        mockGame.divideCards();
        expect(mockGame.turn).toBeDefined();
      });
    });
  });

  describe("player order", () => {
    it("should only pass an order with ids", () => {
      mockGame.getPlayerOrder().forEach((player) => {
        expect(player).not.toHaveProperty("hand");
        expect(player).not.toHaveProperty("table");
        expect(player).toHaveProperty("id");
      });
    });
  });
});
