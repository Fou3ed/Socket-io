'use-stric'
import dotenv from "dotenv";
dotenv.config();
import express from "express";
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
import redis from 'redis'
import { createAdapter } from "@socket.io/redis-adapter";
// import { createClient } from 'redis';

// import redisAdapter from 'socket.io-redis'
import chatSocket from "./src/controllers/socketController.js";

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
 */
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:8080", "https://admin.socket.io"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }
});

/**
 * 
 * This code creates two Redis clients: pubClient and subClient. The pubClient is used to publish messages to Redis channels, while the subClient is used to subscribe to messages from Redis channels.
 *The createClient method of the redis library is used to create a new Redis client. It takes an object as an argument, which can contain various options for configuring the client. In this case, the port and host options are being set using environment variables process.env.REDIS_PORT and process.env.REDIS_HOST, respectively.
 *The subClient is created by calling the duplicate method on the pubClient object. This creates a new client that is a duplicate of the pubClient, but with a separate connection to the Redis server. This allows both the pubClient and subClient to be used simultaneously without interfering with each other.
 *The Promise.all method is used to wait for both the pubClient and subClient to connect to the Redis server before calling the io.adapter method. The createAdapter function is passed the pubClient and subClient as arguments, and returns an adapter that can be used by Socket.IO to communicate with the Redis store.
 * 
 */


//  const client = createClient();
// client.on('error',(err)=>console.log('redis client Error',err))
// await client.connect()
// await client.set('key','value')
// const value = await client.get('key')
// await client.disconnect()

if (process.env.STATUS === "development") {
  const pubClient = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  }    
  );
  const subClient = pubClient.duplicate();
  Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));
})
  chatSocket(io,pubClient)
}

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
 * The ‘uncaughtException’ is an event of class Process within the process module which is emitted when an uncaught JavaScript exception bubbles all the way back to the event loop.
 */
process.on("uncaughtException", (err) => {
  console.log(err.name);
  console.log(err.message);
  console.log("shutting down...");
  process.exit(1);
});
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

/* It's a monitoring tool for socket.io. */
instrument(io, {
  auth: false,
  mode: "development",
});
dbServer();
httpServer.listen(process.env.PORT)
console.log(process.env.PORT)