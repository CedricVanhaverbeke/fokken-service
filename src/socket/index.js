import SocketIO from "socket.io";

import Game from "../game/game";
import Player from "../game/player";

const gameSocket = (server, port) => {
  const io = SocketIO(server, {
    cors: {
      origin: /.*/,
      methods: ["GET", "POST"],
    },
  });

  console.log(`started on port ${port}`);

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
    // TODO: Check for cheating here
    socket.on("PLAY_CARD", (payload) => {
      const cards = JSON.parse(payload);

      const playedNumber = Array.isArray(cards)
        ? cards[0].number
        : cards.number;
      const playedAmount = Array.isArray(cards) ? cards.length : 1;

      let nextPlayer;
      if (playedNumber !== 10) {
        nextPlayer = game.setNextTurn(socket.id);
      }
      const drawedCards = game.deck.popCards(cards.length);

      game.addCardsToPlayedCards(cards);

      // remove card from player that played card
      game.removeCardsFromPlayer(socket.id, cards);

      // add card to deck of player if pile is not empty
      if (drawedCards) {
        game.addCardsToPlayer(socket.id, drawedCards);
      }

      let playerIsOut;
      if (game.playerHasNoCards(socket.id)) {
        // player is out
        game.setPlayerIsOut(socket.id);
        playerIsOut = socket.id;
      }

      game.players.forEach(({ socket: playerSocket }) => {
        playerSocket.emit(
          "CARD_PLAYED",
          JSON.stringify({
            turn: nextPlayer,
            drawPileAmount: game.deck.size(),
            playedCards: game.playedCards,
            playedAmount,
            playerIsOut,
            message: `${
              game.players.find(({ id }) => id === socket.id).userName
            } played ${playedAmount} ${playedNumber}${
              playedAmount > 1 ? "'s" : ""
            }`,
            ...game.getPlayerView(playerSocket.id),
          })
        );
      });

      if (playedNumber === 10) {
        setTimeout(() => {
          game.playedCards = [];

          game.players.forEach(({ socket: playerSocket }) => {
            playerSocket.emit(
              "EMPTY_STACK",
              JSON.stringify({
                turn: game.turn,
                message: `${
                  game.players.find(({ id }) => id === socket.id).userName
                } played a 10 and removed the cards on the table `,
              })
            );
          });
        }, 1000);
      }
    });

    socket.on("TAKE_PLAYED_CARDS", (payload) => {
      const { passTurn } = JSON.parse(payload || {});

      let nextPlayer = game.turn;
      if (passTurn) {
        nextPlayer = game.setNextTurn(socket.id);
      }

      game.addCardsToPlayer(socket.id, game.playedCards);
      game.playedCards = [];

      game.players.forEach(({ socket: playerSocket }) => {
        playerSocket.emit(
          "CARD_PLAYED",
          JSON.stringify({
            turn: nextPlayer,
            drawPileAmount: game.deck.size(),
            playedCards: game.playedCards,
            message: `${
              game.players.find(({ id }) => id === socket.id).userName
            } needed to take all the cards`,
            ...game.getPlayerView(playerSocket.id),
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
