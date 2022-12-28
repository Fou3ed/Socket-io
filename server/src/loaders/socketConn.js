'use-strict'
import {
    Server
} from "socket.io"
import restApi from "./restApi.js";
import actions from '../../dist/simpleFetch.js'
import InMemoryMessageStore from "../constants/messageStore.js";
import InMemorySessionStore from "../constants/sessionStore.js";
import {
    createServer
  } from "http";
  import {
    instrument
} from "@socket.io/admin-ui"
class socketChat {
    constructor() {
        this.server= createServer(restApi)
    }
    /**
     * Initializes the express server
     */
    start() {

        const httpServer = createServer(restApi);
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

        /**
         * simpleFetch actions 
         */
        const foued = new actions()


        const io = new Server(httpServer, {
            
            cors: {

                origin: ["http://localhost:8080", "https://admin.socket.io"],
                credentials: true,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

            }



        })
        ;

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
            console.log(socket.username, "is connected to the socket :", socket.id, " in session :", socket.sessionID)
            // persist session
            sessionStore.saveSession(socket.sessionID, {
                userID: socket.userID,
                username: socket.username,
                connected: true,
            });

            socket.emit("onConnect")


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
                let data = {
                    "type": "MESG",
                    "conversation_id": "63907b74266e3b8358516cd1",
                    "user": "6390b306dfb49a27e7e3c0bb",
                    "mentioned_users": "6390b4d54a1ba0044836d613",
                    "readBy": "6390b4d54a1ba0044836d613",
                    "is_removed": false,
                    "message": message.content,
                    "data": "additional message information ",
                    "attachments": {
                        "key": "value"
                    },
                    "parent_message_id": "6390bbb76b96e925c5eb1858",
                    "parent_message_info": "6390bbb76b96e925c5eb1858",
                    "location": "",
                    "origin": "web",
                    "read": null
                }
                foued.addMsg(data)
            });

            socket.on('read-msg', (data) => {
                console.log("message been read")
                io.to(data.userId).emit('read-msg', data);
                foued.readMsg(data.messageId)
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


    }
    /**
     * @returns
     */
    getSocket() {
        return this.server
    }
}

export default socketChat