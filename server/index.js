import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import {
  Server
} from "socket.io";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import {
  createServer
} from "http";
import {
  instrument
} from "@socket.io/admin-ui"
import router from '../server/src/routes/appRoutes.js'
import routerC from '../server/src/routes/connectionRoutes.js'
import routerCNV from '../server/src/routes/conversationsRoutes.js'
import routerMember from '../server/src/routes/convMemberRoutes.js'
import routerUser from '../server/src/routes/userRoutes.js'
import routerMessage from '../server/src/routes/messageRoutes.js'
import routerRole from '../server/src/routes/roleRoutes.js'
import routerMedia from '../server/src/routes/mediaRoutes.js'
import dbServer from "./DB.js";
import process from 'node:process';
import crypto from "crypto"
import InMemoryMessageStore from "../server/src/constants/messageStore.js";
import InMemorySessionStore from "../server/src/constants/sessionStore.js";


/**
 * => Calls the express function "express()" and puts new Express application inside the app variable (to start a new Express application).
 *  It's something like you are creating an object of a class. Where "express()" is just like class and app is it's newly created object.
 */
const app = express();

/**
 *******************************************************     SERVER INITIALIZATION    ************************************************************************************
 */

/**
 *  The http.createServer() method turns your computer into an HTTP server.
 *  The http.createServer() method creates an HTTP Server object.
 *   The HTTP Server object can listen to ports on your computer and execute a function, a requestListener, each time a request is made. 
 */
const httpServer = createServer(app);

/**
 *  SOCKET Initialization with EXPRESS and Settling CORS options 
 *    
 */
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:8080", "https://admin.socket.io"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

  }
});

/**
 * The app.use() function adds a new middleware to the app.
 *  Essentially, whenever a request hits your backend, Express will execute the functions you passed to app.use() in order.
 * 
 *  express.json() is a built in middleware function in Express starting from v4.16.0. It parses incoming JSON requests and puts the parsed data in req.body.
 */
app.use(express.json());

/**
 * The express.urlencoded() function is a built-in middleware function in Express.
 * It parses incoming requests with urlencoded payloads and is based on body-parser.
 * inflate − This enables or disables the handling of the deflated or compressed bodies. Default: true
 *      limit − This controls the maximum size of the request body.
 *      extended − This option allows to choose between parsing the URL encoded data with the queryString Library or the qs Library.
 *     type − This determines the media type for the middleware that will be parsed.
 *     parameterLimit − This option controls the maximum number of parameters that are allowed in the URL-encoded data. 
 */
app.use(express.urlencoded({
  extended: true
}));
/**
 * to check later if it's gonna stay or not (cz upstairs there is something like it )
 */
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*")
  res.header("Access-Control-Allow-Methods", " GET,POST,PUT,DELETE,OPTIONS ")
  next();
});
/**
 * The ‘uncaughtException’ is an event of class Process within the process module which is emitted when an uncaught JavaScript exception bubbles all the way back to the event loop.
 */
process.on("uncaughtException", (err) => {
  console.log(err.name);
  console.log(err.message);
  console.log("shutting down...");
  process.exit(1);
});

/**
 * to check later too
 */
const corsOptions = {
  origin: "*",
  header: "*",
  methods: "*",
  credentials: true,

};
app.use(cors(corsOptions));

/**
 * Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
 * 
 */
app.use(helmet());
/**
 * REST API ROUTES 
 */
app.use("/app", router)
app.use("/connection", routerC)
app.use("/conversations", routerCNV)
app.use("/members", routerMember)
app.use("/users", routerUser)
app.use("/message", routerMessage)
app.use("/role", routerRole)
app.use("/media", routerMedia)
app.use(cookieParser());

/**
 * 
 * @returns a Crypted string 
 */
const randomId = () => crypto.randomBytes(8).toString("hex");
/**
 * implement: store all the Sessions on the server-side.
 */
const sessionStore = new InMemorySessionStore();
/**
 * implement: store all the messages on the server-side.
 */
const messageStore = new InMemoryMessageStore();

/***
 * io.use() allows you to specify a function that is called for every new, incoming socket.io connection. It can be used for a wide variety of things such as:
 * Logging,Authentication,Managing sessions,Rate limiting,Connection validation
 */
io.use((socket, next) => {
  /**
   * a session ID, private, which will be used to authenticate the user upon reconnection a user ID, public, which will be used as an identifier to exchange messages
   *  
   */
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }

  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  // persist session
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });

  // emit session details
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });

  // join the "userID" room
  socket.join(socket.userID);

  // fetch existing users
  const users = [];
  const messagesPerUser = new Map();
  messageStore.findMessagesForUser(socket.userID).forEach((message) => {
    const {
      from,
      to
    } = message;
    const otherUser = socket.userID === from ? to : from;
    if (messagesPerUser.has(otherUser)) {
      messagesPerUser.get(otherUser).push(message);
    } else {
      messagesPerUser.set(otherUser, [message]);
    }
  });
  sessionStore.findAllSessions().forEach((session) => {
    users.push({
      userID: session.userID,
      username: session.username,
      connected: session.connected,
      messages: messagesPerUser.get(session.userID) || [],
    });
  });
  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    connected: true,
    messages: [],
  });

  // forward the private message to the right recipient (and to other tabs of the sender)
  socket.on("private message", ({
    content,
    to
  }) => {
    const message = {
      content,
      from: socket.userID,
      to,
    };
    socket.to(to).to(socket.userID).emit("private message", message);
    messageStore.saveMessage(message);
  });
  // notify users upon disconnection
  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: false,
      });
    }
  });
});

/**
 * monitoring
 *  */
instrument(io, {
  auth: false,
  mode: "development",
});

dbServer();
httpServer.listen(process.env.PORT)
console.log(process.env.PORT)