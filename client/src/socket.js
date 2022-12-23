import { io } from "socket.io-client";
const URL = "http://localhost:3000";

/**
 * autoConnect is set to false so the connection is not established right away. 
 * We will manually call socket.connect() later, once the user has selected a username.
 */
const socket = io(URL, { autoConnect: false });

/**
 * register a catch-all listener
 * So that any event received by the client will be printed in the console.
 */
socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
