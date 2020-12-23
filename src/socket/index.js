import Server from "socket.io";

import Game from "../game/game";
import Player from "../game/player";

const gameSocket = (port) => {
  const io = Server(port, {
    cors: {
      origin: "http://localhost:5000",
      methods: ["GET", "POST"],
    },
  });

  console.log("Socket listening started");

  const games = {};

  io.on("connection", (socket) => {
    const { userName, roomId } = socket.handshake.query;

    const player = new Player(userName, socket);

    let game;
    if (!games[roomId]) {
      game = new Game(roomId, player);
      games[roomId] = game;
    } else {
      game = games[roomId];
      game.addPlayer(player);
    }

    socket.join(roomId);

    const { socket: _socket, ...newPlayerJSON } = player;

    // Notify all other players of new player
    socket.to(roomId).emit("NEW_PLAYER", JSON.stringify(newPlayerJSON));
    socket.emit(
      "NEW_PLAYER",
      JSON.stringify(
        game.players
          .filter((player) => player.socket.id !== socket.id)
          .map((p) => {
            // filter out non needed things
            const { socket: _socket, hand, table, ...playerJson } = p;
            return playerJson;
          })
      )
    );

    console.log("Client connected! with following credentials: ", {
      userName,
      roomId,
    });

    socket.on("START_GAME", () => {
      game.divideCards();

      game.players.forEach(({ socket: playerSocket, id }) => {
        playerSocket.emit(
          "DIVIDED_CARDS",
          JSON.stringify({
            ...game.getPlayerView(id),
            order: game.getPlayerOrder(),
            assignedId: id,
            turn: game.turn,
            drawPileAmount: game.deck.size(),
          })
        );
      });
    });

    // If a player plays a card, all other players need to be notified.
    socket.on("PLAY_CARD", (payload) => {
      const card = JSON.parse(payload);
      const nextPlayer = game.setNextTurn(socket.id);
      const drawedCard = game.deck.popCards(1);

      // add card to deck of player if pile is not empty
      if (drawedCard) {
        game.addCardToPlayer(socket.id, card);
      }

      game.players.forEach(({ socket: playerSocket }) => {
        playerSocket.emit(
          "CARD_PLAYED",
          JSON.stringify({
            ...card,
            turn: nextPlayer,
            drawPileAmount: game.deck.size(),
            ...game.getPlayerView(id),
            ...(socket.id === playerSocket.id && { drawedCard }),
          })
        );
      });
    });

    socket.on("disconnect", (reason) => {
      console.log("Client disconnected: ", reason);
    });
  });
};

export default gameSocket;
