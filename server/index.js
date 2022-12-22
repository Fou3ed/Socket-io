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


app.use(cookieParser());

io.on("connection", (socket) => {
    console.log(socket)
});
// monitoring 
instrument(io, {
    auth: false,
    mode: "development",
});
dbServer();
httpServer.listen(process.env.PORT)
console.log(process.env.PORT)