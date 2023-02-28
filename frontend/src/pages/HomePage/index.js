import "./style.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setHost, setPlayer, setID } from "../../actions/userType";
import { socket } from "../../socket/index.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/fontawesome-free-solid";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //no of users online, default is 0
  const [playerCount, setPlayerCount] = useState(0);
  const [error, setError] = useState(undefined);
  //username form
  const [usrInput, setUsrInput] = useState(undefined);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState(undefined);
  //To show all connected users
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    socket.on("users", (users) => setPlayerCount(users));
    socket.on("new user", (allUsers) => {
      setAllUsers(allUsers);
    });
  }, []);

  socket.on("no room", (msg) => {
    setError(msg);
  });

  useEffect(() => {
    socket.on("assign-id", (id) => {
      console.log("assign_id", id);
      dispatch(setID(id));
    });
    socket.emit("join server", username);
  }, [username]);

  const renderUser = (user, i) => {
    return <p key={i}>{user.username}</p>;
  };

  const handleInput = (e) => {
    setError(undefined);
    setUsrInput(e.target.value);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const player = usrInput;
    setUsername(player);
    if (player === undefined) {
      setError("Please enter a username to become a Quizzer");
    } else if (room === undefined) {
      setError("To create a room or join a game, please set a room name");
    } else {
      socket.emit("check-room", room, (res) => {
        if (res.code === "success") {
          setRoom(room);
          dispatch(setHost(player, room));
          navigate("/game");
        } else {
          setRoom(undefined);
          console.warn(error);
          setError(res.message);
        }
      });
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    setError("");
    const player = usrInput;
    setUsername(player);
    if (player === undefined) {
      setError(" introduce yourself!");
    } else if (room === undefined) {
      setError(" create room or give an existing name");
    } else {
      const config = {
        room: room,
        username: player,
        id: socket.id,
      };
      socket.emit("join-room", config, (res) => {
        if (res.code === "success") {
          setRoom(room);
          dispatch(setPlayer(player, room));
          navigate("/waitingroom");
        } else {
          setRoom(undefined);
          setError(res.message);
        }
      });
    }
  };

  const handleRoomInput = (e) => {
    setError("");
    setRoom(e.target.value);
  };

  const renderJoin = () => {
    let toggle = "join";
    let joinText = "Join Room";
    if (playerCount < 2) {
      toggle = "disabled";
      joinText = "No rooms to join";
    }
    return (
      <>
        <button
          type="submit"
          id="join"
          className={toggle}
          name="joinQuiz"
          value={joinText}
          onClick={handleJoin}
        >
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          JOIN QUIZ
        </button>
      </>
    );
  };

  const leaderBoard = () => {
    navigate("./leaderboard");
  };

  return (
    <div id="welcome">
      <p id="leaderboardIcon" onClick={leaderBoard}>
        LEADERBOARD <FontAwesomeIcon className="iconT" icon={faTrophy} beat />
      </p>
      <h1>LeagueX Quiz App</h1>
      <form role="form">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="PLAYER NAME"
          value={usrInput || ""}
          onChange={handleInput}
        />
      </form>
      <form autoComplete="off">
        <label htmlFor="roomName">Room Name</label>
        <input
          type="text"
          id="roomName"
          name="roomName"
          placeholder="ROOM NAME"
          value={room || ""}
          onChange={handleRoomInput}
        />

        <div
          className="button-container"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <button
            type="submit"
            name="newQuiz"
            className="newQuiz"
            value="New Game"
            onClick={handleCreate}
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            NEW GAME
          </button>

          {renderJoin()}
        </div>
      </form>
      <div>
        {playerCount <= 0
          ? "No Quizzers Online"
          : `Quizzers Online: ${playerCount}`}
        {error && <p className="error">{error}</p>}
      </div>
      <div>
        {allUsers.length <= 0
          ? "No Quizzers Online :("
          : `Quizzers Online: ${playerCount}` && (
              <div className="usersOnline">{allUsers.map(renderUser)}</div>
            )}
      </div>
    </div>
  );
};

export default HomePage;
