import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { createServer } from "http";
import { instrument } from "@socket.io/admin-ui"
import router from "../Socket-io/src/routes/appRoutes.js";
import routerC from '../Socket-io/src/routes/connectionRoutes.js'
import routerCNV from '../Socket-io/src/routes/conversationsRoutes.js'
import routerMember from '../Socket-io/src/routes/convMemberRoutes.js'
import routerUser from '../Socket-io/src/routes/userRoutes.js'
import routerMessage from '../Socket-io/src/routes/messageRoutes.js'
import routerRole from '../Socket-io/src/routes/roleRoutes.js'
import routerMedia from '../Socket-io/src/routes/mediaRoutes.js'
import dbServer from "./DB.js";
import process from 'node:process';
//import {getConversationByIdEvent, getConversationsEvent} from '../Socket-io/src/events/conversationsEvents.js'

process.on("uncaughtException", (err) => {
    console.log(err.name);
    console.log(err.message);
    console.log("shutting down...");
    process.exit(1);
});

const app = express();

/**
 *      SERVER INITIALIZATION
 */
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["https://localhost:3000", "https://admin.socket.io"],
        credentials: true
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173"); // update to match the domain you will make the request from
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
const corsOptions = {
    origin: "*",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
// Routes 
app.use("/app", router)
app.use("/connection", routerC)
app.use ("/conversations",routerCNV)
app.use ("/members",routerMember)
app.use ("/users",routerUser)
app.use ("/message",routerMessage)
app.use ("/role",routerRole)
app.use ("/media",routerMedia)

app.use(cookieParser());
//const id="6390b021dfb49a27e7e3c0a5"
//getConversationsEvent.emit('getConversations');
//getConversationByIdEvent.emit('getConversationById',id)



io.on("connection", (socket) => {
    console.log(socket)
});
instrument(io, {
    auth: false,
    mode: "development",
});
dbServer();
httpServer.listen(3000);
