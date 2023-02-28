const express = require("express");
const mongoose = require("mongoose");
const app = express();
var cors = require("cors");
const http = require("http");
const cluster = require("cluster");
const os = require("os");
const numCpu = os.cpus().length;
const PORT = process.env.PORT || 3003;
const routes = require("./routes");
const passport = require("./config/passport");
let server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const session = require("express-session");
const path = require("path");
const db = require("./models");
const { Games } = require("./Games");

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "the cat ate my keyboard",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

// app.use(express.static(path.join(__dirname, "client")));
// app.get("/", (req, res) =>
//   res.send("Hello, world! Welcome to QuizProQuo's API!")
// );

mongoose.set("strictQuery", false);

mongoose.connect(
  "mongodb+srv://dbUser:0000@cluster0.jo5owox.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);
const dbs = mongoose.connection;
dbs.on("error", console.error.bind(console, "connection error: "));
dbs.once("open", function () {
  console.log("Connected successfully");
});

const games = new Games();

let users = [];

io.on("connection", (socket) => {
  console.log("connected in socket");
  socket.emit("assign-id", { id: socket.id });

  socket.on("join server", (username) => {
    const user = {
      username,
      id: socket.id,
    };

    users.push(user);
    io.emit("new user", users);
  });

  let participantCount = io.engine.clientsCount;
  io.emit("users", participantCount);

  socket.on("check-room", (roomName, callback) => {
    console.log("CLIENT REQUEST TO CREATE ROOM WITH ", roomName);

    games.createRoom(roomName);

    if (games.checkRoomName(roomName)) {
      callback({
        code: "success",
        message: `SUCCESS: Created room with name ${roomName}`,
      });
    } else {
      callback({
        code: "ERROR",
        message: `Room name ${roomName} is taken. Please try another name.`,
      });
    }
  });

  socket.on("add-config", (config, cb) => {
    console.log("inhere for config");
    games.addGame(
      config.host,
      config.room,
      config.difficulty,
      config.count,
      config.subject
    );
    socket.join(config.host);

    games.addPlayer(config.username, config.room, config.host);

    cb({
      code: "success",
      message: `SUCCESS: configuration has been added`,
    });
  });
  socket.on("game-start", (roomName) => {
    console.log("game started");
    io.to(roomName).emit("game-start", true);
  });

  socket.on("join-room", (config, cb) => {
    console.log(" join-room ", config);
    console.log("games in join-room", games);
    let foundRoom = games.canRoomBeJoined(config.room);
    console.log("join-room", foundRoom);

    if (foundRoom == "ERROR") {
      console.log("no room found");
      const errorMsg = "Room does not exist";
      io.to(config.id).emit("no room", errorMsg);
    } else {
      console.log("adding player");
      games.addPlayer(config.username, config.room, socket.id);
      socket.join(config.room);
      socket.emit(`${config.username} has joined the room`);
      io.emit("new peon", config.username);
      let game = games.getGameByRoom(config.room);

      cb({
        code: "success",
        player: config.username,
        score: 0,
      });

      io.to(game.host).emit("player-connected", {
        name: config.username,
        score: 0,
      });
    }
  });

  socket.on("message sent", ({ nicknameChosen, message, room }) => {
    socket.broadcast.emit("receive message", nicknameChosen, message);
    console.log(
      "message received:",
      "nickname:",
      nicknameChosen,
      "message:",
      message,
      "room:",
      room
    );
  });

  let gamePlayers;
  let roomNameVar;
  socket.on("game-players", (roomName, cb) => {
    const data = games.getPlayerData(roomName);
    gamePlayers = data;
    roomNameVar = roomName;
    io.in(roomName).emit(data);

    cb(data);
  });

  io.to(roomNameVar).emit("game-players");

  socket.on("game-start", (roomName) => {
    console.log("game started");
    io.to(roomName).emit("game-start", true);
  });

  socket.on("get-questions", (roomName, cb) => {
    const data = games.getGame(roomName);
    cb(data);
  });

  socket.on("score", (config, cb) => {
    console.log("SCORE TALLY");
    let scores = games.addScore(config.room, config.username, config.score);
    io.to(config.room).emit("score", scores);
    cb({
      code: "success",
      scores: scores,
    });
  });

  socket.on("disconnect", () => {
    users = users.filter((u) => u.id !== socket.id);
    io.emit("new user", users);
    participantCount = io.engine.clientsCount;
    io.emit("users", participantCount);
  });
});

// if (cluster.isMaster) {
//   for (let i = 0; i < numCpu; i++) {
//     cluster.fork();
//   }
//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//     cluster.fork();
//   });
// } else {
//   server.listen(PORT, () => {
//     console.log(`Server is running ${process.pid} at port  ${PORT}`);
//   });
// }
server.listen(PORT, () => {
  console.log(`Server is running ${process.pid} at port  ${PORT}`);
});

process.on("SIGINT", () => {
  mongoose.connection.close().then(() => {
    console.log("Mongoose disconnected");
    process.exit(0);
  });
});
