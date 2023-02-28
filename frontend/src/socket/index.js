import io from "socket.io-client";
const serverEndpoint = "http://localhost:3003";
const socket = io(serverEndpoint);

export { socket };
