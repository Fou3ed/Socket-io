
//sockets
import {setupChatSocket} from '../socket/serverEvents.js'

const chatSocket = function (io, pubClient) {

  let clients = (pubClient.get('clients'));
  console.log("hedhy l " , clients)
  if (!clients) clients = [];
  io.sockets.on('connection', function (socket) {
    setupChatSocket(socket, clients, pubClient,io);
  });
};

export default chatSocket