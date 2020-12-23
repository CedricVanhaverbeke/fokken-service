import Card from "./card";

describe("Card", () => {
  it("should create an object", () => {
    const card = new Card(1, 2);

    expect(card).toHaveProperty("number");
    expect(card).toHaveProperty("suit");
  });

  it("should throw on weird values", () => {
    expect(() => new Card()).toThrow();
    expect(() => new Card(0, 0)).toThrow();
    expect(() => new Card(14, 1)).toThrow();
    expect(() => new Card(-1, -1)).toThrow();
  });
});
