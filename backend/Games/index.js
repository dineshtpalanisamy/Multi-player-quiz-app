class Games {
  constructor() {
    this.games = [];
    this.players = [];
  }

  addGame(hostID, roomName, difficulty, count, subject) {
    let game = {
      host: hostID,
      room: roomName,
      difficulty: difficulty,
      count: count,
      subject: subject,
      players: [],
      active: false,
    };

    this.games.push(game);

    this.games.forEach((room) => console.log(room));
    return game;
  }

  createRoom(roomName) {
    console.log("came createRpoom");

    this.games.push(roomName);
  }

  addPlayer(username, room, hostID) {
    let player = {
      username: username,
      roomName: room,
      roomID: hostID,
      score: 0,
    };

    this.players.push(player);
    let game = this.games.find((y) => y.room == room);
    try {
      game.players.push(player);
      console.log(game.players);
      return player;
    } catch (err) {
      console.log("add player has : " + err);
      return { err: err };
    }
  }

  getPlayersForGame(roomName) {
    const game = this.games.filter((game) => game.room === roomName);
    console.log(game.players);
  }

  filterRoom(roomName) {
    return this.games.room === roomName;
  }

  getPlayerCount = (roomName) => {
    console.log("check player count");
    const game = this.games.filter((game) => game.room === roomName);

    return game.players.length;
  };

  //check the room id
  //get players with room id
  getPlayerData(roomName) {
    let game = this.games.find((y) => y.room == roomName);

    if (game === undefined) {
      return "error";
    }
    return game.players;
  }

  addScore(room, username, score) {
    //find the game
    let game = this.games.find((y) => y.room == room);
    //in the room find the player usernmae
    console.log("addscore gameroom", game);
    // console.log(username, "addscore username");
    console.log("score : ", score);
    try {
      let player = game.players.find((p) => p.username === username);
      console.log("player", player);
      player.score = score;
      console.log("player 222", player);
      return game.players;
    } catch (err) {
      console.log("add score error: " + err);
      return { err: err };
    }
  }

  getGame(roomName) {
    let game = this.games.find((y) => y.room == roomName);
    return game;
  }

  canRoomBeJoined(roomName) {
    const game = this.games.filter((game) => {
      console.log(game.room === roomName);
      return game.room === roomName;
    });
    console.log("game name", game);
    if (this.games.length > 0) {
      return game;
    } else {
      return "ERROR";
    }
  }
  getGameByRoom(roomName) {
    this.games.forEach((game) => console.log(game));
    const game = this.games.filter((game) => {
      console.log(game.room === roomName);
      return game.room === roomName;
    });
    return game;
  }

  checkRoomName(room) {
    console.log(" Room : ", room);
    let game = this.getGameByRoom(room);
    if (game.length > 0) {
      return false;
    } else {
      return true;
    }
  }
}

module.exports = { Games };
