import { TestScheduler } from "jest";
import Card from "./card";
import Player from "./player";

const mockSocket = {
  id: "mockId",
};

const mockTable = [
  [new Card(1, 0), new Card(1, 1)],
  [new Card(2, 0), new Card(2, 1)],
  [new Card(3, 0), new Card(3, 1)],
];

const mockHand = [
  new Card(1, 2),
  new Card(1, 2),
  new Card(3, 2),
  new Card(4, 2),
];

const mockName = "Cedric";

describe("Player", () => {
  const mockPlayer = new Player(mockName, mockSocket);

  it("should add a card", () => {
    mockPlayer.hand = [new Card(1, 0)];
    expect(mockPlayer.hand.length).toBe(1);

    mockPlayer.addCardToHand(new Card(10, 0));
    expect(mockPlayer.hand.length).toBe(2);
  });

  it("should remove a card from the hand of the player", () => {
    mockPlayer.hand = [new Card(1, 0)];
    expect(mockPlayer.hand.length).toBe(1);

    mockPlayer.removeCardFromHand(new Card(1, 0));
    expect(mockPlayer.hand.length).toBe(0);
  });

  describe("remove card from table", () => {
    beforeEach(() => {
      mockPlayer.table = JSON.parse(JSON.stringify(mockTable));
      mockPlayer.hand = JSON.parse(JSON.stringify(mockHand));
    });

    it("should remove a card from the table cards of the player", () => {
      mockPlayer.removeCardFromTable(new Card(1, 0));
      expect(mockPlayer.table[0].length).toBe(1);
    });

    it("should remove a card from the table cards of the player", () => {
      mockPlayer.removeCardFromTable(new Card(1, 0));
      expect(mockPlayer.table[0].length).toBe(1);

      mockPlayer.removeCardFromTable(mockPlayer.table[0][0]);
      expect(mockPlayer.table[0].length).toBe(0);
    });

    it("should remove all cards", () => {
      let amount = 6;
      for (let i = 0; i < 3; i++) {
        mockPlayer.removeCardFromTable(mockPlayer.table[i][0]);
        expect(mockPlayer.table[i].length).toBe(1);
        amount--;
        expect(mockPlayer.table.flat().length).toBe(amount);

        mockPlayer.removeCardFromTable(mockPlayer.table[i][0]);
        expect(mockPlayer.table[i].length).toBe(0);
        amount--;
        expect(mockPlayer.table.flat().length).toBe(amount);
      }
    });

    it("Should remove a card from somewhere", () => {
      mockPlayer.removeCard(mockPlayer.hand[0]);

      expect(mockPlayer.hand).toHaveLength(3);
      expect(mockPlayer.table.flat()).toHaveLength(6);

      mockPlayer.removeCard(mockPlayer.table[0][0]);
      expect(mockPlayer.table[0].length).toBe(1);
      expect(mockPlayer.table.flat().length).toBe(5);
    });

    it("Should throw because card is both in hand and on table", () => {
      mockPlayer.hand = [new Card(1, 1)];
      mockPlayer.table = [[new Card(1, 1)], [], []];

      expect(() => mockPlayer.removeCard(new Card(1, 1))).toThrow();
    });

    it("Should throw because the card to be removed is not found", () => {
      expect(() => mockPlayer.removeCard(new Card(9, 1))).toThrow();
    });
  });
});
