
//import User from '../models/userModel.js'
import actions from '../../dist/actions.js'

export const setupChatSocket = function (socket, clients, pubClient, io) {
    console.log("d5al lennna ")
    const foued = new actions()
    socket.on('add-listener', async function (data) {
        let id = parseInt(data.id);
        if (!clients.find((client) => client.socketId === socket.id)) {
            foued.getUser(id)
            foued.addUser(id,socket.id)
            pubClient.set('clients', JSON.stringify(clients));
            socket.join(socket.id);
            update_users();
        }
    });
    //Add a user to a room
    socket.on('add-user', function (data) {
        socket.join(data.roomId);
    });

    socket.on('read-msg', (data) => {
        io.to(data.userID).emit('read-msg', data);
        foued.readMsg(data)
      });
    
    function update_users() {
        console.log(clients);
        io.emit('users_list', {
            users: clients
        });
    }
}
    export default setupChatSocket