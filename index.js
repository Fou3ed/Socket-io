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
import {printMsg,getCnv} from "../Socket-io/src/errors/newFn.js"

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
        origin: "*",
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    }
});

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "*")
    res.header("Access-Control-Allow-Methods", " GET,POST,PUT,DELETE,OPTIONS ")

    next();
});
const corsOptions = {
    origin: "*",
    header: "*",
    methods: "*",
    credentials: true,

};

app.use(cors(corsOptions));
app.use(helmet());
// Routes 
app.use("/app", router)
app.use("/connection", routerC)
app.use("/conversations", routerCNV)
app.use("/members", routerMember)
app.use("/users", routerUser)
app.use("/message", routerMessage)
app.use("/role", routerRole)
app.use("/media", routerMedia)
printMsg()
getCnv()
//app.use(main())
//getConversationsEvent.emit('getConversations')
//getCnv()
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

httpServer.listen(process.env.PORT)