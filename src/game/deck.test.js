import Deck from "./deck";

describe("Deck", () => {
  it("should create a deck with 52 playing cards", () => {
    const deck = new Deck();

    expect(deck.cards).toHaveLength(52);
  });

  it("should shuffle the deck", () => {
    const deck1 = new Deck();
    const deck2 = new Deck();

    expect(deck1).not.toBe(deck2);
  });

  it("should shuffle the deck on creation", () => {
    const deck1 = new Deck();
    const deck2 = new Deck();

    expect(deck1).not.toBe(deck2);
  });

  describe("Pop card", () => {
    const mockDeck = new Deck();
    it("should pop one card from the stack and return it just like that", () => {
      const card = mockDeck.popCards(1);

      expect(Array.isArray(card)).toBeFalsy();
    });

    it("should pop more cards from the stack and return it as an array", () => {
      const card = mockDeck.popCards(5);

      expect(Array.isArray(card)).toBeTruthy();
    });
  });
});
