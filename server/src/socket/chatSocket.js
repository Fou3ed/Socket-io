import User from '../models/userModel.js'
const setupChatSocket = function (socket, clients, pubClient, io) {
    socket.on('add-listener', async function (data) {
        let id = parseInt(data.id);
        if (!clients.find((client) => client.socketId === socket.id)) {
            let user = await User.findOne({
                where: {
                    id: id
                }
            });
            clients.push({
                id: id,
                socketId: socket.id,
                appId: user.app_id,
            });
            pubClient.set('clients', JSON.stringify(clients));
            socket.join(socket.id);
            update_users();
        }
    });
    //Add a user to a channel
    socket.on('add-user', function (data) {
        socket.join(data.channelId);

    });
    //Channel events
    socket.on('deleted-msg', function (data) {
        io.to(data.channelId).emit('delete-msg',data);
    });
    socket.on('hidden-msg', function (data) {
        io.to(data.channelId).emit('hide-msg', data);
    });
    socket.on('pinned-msg', function (data) {
        io.to(data.channelId).emit('pin-msg', data);
    });
    socket.on('react-on-msg', function (data) {
        io.to(data.channelId).emit('react-msg', data);
    });
    socket.on('unReact-on-msg', function (data) {
        io.to(data.channelId).emit('unreact-msg', data);
    });
    socket.on('typing-message', function (data) {
        io.to(data.channelId).emit('typing-message', data);
    });
    socket.on('stop-typing-message', function (data) {
        io.to(data.channelId).emit('stop-typing-message', data);
    });
    //tell users with id included in data.ids to update their channel info
    socket.on('update-user-channel', function (data) {
        clients.forEach((client) => {
            if (data.ids.includes(client.id)) {
                socket.nsp.to(client.socketId).emit('update-channel', data);
            }
        });
    });
    //tell users with id included in data.ids to update their channel info
    socket.on('remove-users-from-org', function (data) {
        clients.forEach((client) => {
            if (data.ids.includes(client.id)) {
                socket.nsp.to(client.socketId).emit('remove-users-from-org', data);
            }
        });
    });

    socket.on('add-users-to-org', function (data) {
        clients.forEach((client) => {
            if (data.ids.includes(client.id)) {
                socket.nsp.to(client.socketId).emit('add-users-to-org', data);
            }
        });
    });

    socket.on('delete-user-channel', function (data) {
        clients.forEach((client) => {
            if (data.ids.includes(client.id)) {
                socket.nsp.to(client.socketId).emit('delete-user-channel', data);
            }
        });
    });

    socket.on('channel-message', function (data) {
        io.to(data.channelId).emit('add-channel-message', data);
    });

    //Private chat
    socket.on('add-puser', function (data) {
        socket.join(data.roomId);
    });
    socket.on('send-pmsg', function (data) {
        io.to(data.roomId).emit('send-pmsg', data);
    });
    socket.on('deleted-pmsg', function (data) {
        io.to(data.roomId).emit('delete-pmsg', data);
    });
    socket.on('hidden-pmsg', function (data) {
        io.to(data.roomId).emit('hide-pmsg', data);
    });
    socket.on('pinned-pmsg', function (data) {
        io.to(data.roomId).emit('pin-pmsg', data);
    });
    socket.on('react-on-pmsg', function (data) {
        io.to(data.roomId).emit('react-pmsg', data);
    });
    socket.on('unReact-on-pmsg', function (data) {
        io.to(data.roomId).emit('unreact-pmsg', data);
    });
    socket.on('typing-pmsg', function (data) {
        io.to(data.roomId).emit('typing-pmsg', data);
    });
    socket.on('stop-typing-pmsg', function (data) {
        io.to(data.roomId).emit('stop-typing-pmsg', data);
    });
    socket.on('new_notification', function (data) {
        clients.forEach((client) => {
            if (data.ids.includes(client.id)) {
                socket.nsp.to(client.socketId).emit('new_notification', data);
            }
        });
    });
    socket.on('update_users', update_users);
    //Removing the socket on disconnect
    socket.on('disconnect', async function () {
        console.log('socketId', socket.id);
        let client = clients.find((client) => client.socketId === socket.id);
        console.log('client disconnected', client);
        if (client) {
            try {
                await User.update({
                    status: 'Offline'
                }, {
                    where: {
                        id: client.id
                    }
                });
            } catch (error) {
                console.log(error);
            }
            io.emit('logout', {
                client
            });
            clients.splice(clients.indexOf(client), 1);
            pubClient.set('clients', JSON.stringify(clients));
        }
        update_users();
    });

    function update_users() {
        console.log(clients);
        io.emit('users_list', {
            users: clients
        });
    }
};

export default setupChatSocket