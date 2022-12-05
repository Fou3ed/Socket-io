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
import dbServer from "./DB.js";
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
app.use("/app", router)
app.use(cookieParser());


io.on("connection", (socket) => {
    console.log(socket)
});
instrument(io, {
    auth: false,
    mode: "development",
});
dbServer();
httpServer.listen(3000);