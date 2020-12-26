import validMoves from "./validMoves";

describe("validMoves", () => {
  it("should show the correct cards", () => {
    expect(validMoves({ number: 1 })).toMatchObject([
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      "J",
      "Q",
      "K",
    ]);
  });

  it("should show the correct cards", () => {
    expect(validMoves({ number: 2 })).toMatchObject([
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      "J",
      "Q",
      "K",
      2, // special card
    ]);
  });

  it("should show the correct cards", () => {
    expect(validMoves({ number: 3 })).toMatchObject([
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      "J",
      "Q",
      "K",
      2, // special card
    ]);
  });

  it("should show the correct cards", () => {
    expect(validMoves({ number: 4 })).toMatchObject([
      5,
      6,
      7,
      8,
      9,
      10,
      "J",
      "Q",
      "K",
      2, // special card
    ]);
  });

  it("should show the correct cards", () => {
    expect(validMoves({ number: 5 })).toMatchObject([
      6,
      7,
      8,
      9,
      10,
      "J",
      "Q",
      "K",
      2, // special card
    ]);
  });
  it("should show the correct cards", () => {
    expect(validMoves({ number: 6 })).toMatchObject([
      7,
      8,
      9,
      10,
      "J",
      "Q",
      "K",
      2, // special card
    ]);
  });

  it("should show the correct cards", () => {
    expect(validMoves({ number: 7 })).toMatchObject([
      8,
      9,
      10,
      "J",
      "Q",
      "K",
      2, // special card
      7, // special card
    ]);
  });

  it("should show the correct cards", () => {
    expect(validMoves({ number: 8 })).toMatchObject([
      9,
      10,
      "J",
      "Q",
      "K",
      2, // special card
      7, // special card
    ]);
  });

  it("should show the correct cards", () => {
    expect(validMoves({ number: 9 })).toMatchObject([
      10,
      "J",
      "Q",
      "K",
      2, // special card
      7, // special card
      9, // spcial card
    ]);
  });

  it("should show the correct cards", () => {
    expect(validMoves({ number: 10 })).toMatchObject([
      "J",
      "Q",
      "K",
      2, // special card
      7, // special card
      9, // spcial card
      10, // special card
    ]);
  });

  it("should show the correct cards", () => {
    expect(validMoves({ number: "J" })).toMatchObject([
      "Q",
      "K",
      2, // special card
      7, // special card
      9, // spcial card
      10, // special card
    ]);

    expect(validMoves({ number: 11 })).toMatchObject([
      "Q",
      "K",
      2, // special card
      7, // special card
      9, // spcial card
      10, // special card
    ]);
  });

  it("should show the correct cards", () => {
    expect(validMoves({ number: "Q" })).toMatchObject([
      "K",
      2, // special card
      7, // special card
      9, // spcial card
      10, // special card
    ]);

    expect(validMoves({ number: 12 })).toMatchObject([
      "K",
      2, // special card
      7, // special card
      9, // spcial card
      10, // special card
    ]);
  });

  it("should show the correct cards", () => {
    expect(validMoves({ number: "K" })).toMatchObject([
      2, // special card
      7, // special card
      9, // spcial card
      10, // special card
    ]);

    expect(validMoves({ number: 13 })).toMatchObject([
      2, // special card
      7, // special card
      9, // spcial card
      10, // special card
    ]);
  });
});
