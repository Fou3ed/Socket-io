// let timeout = 1000;
// let retrying = false;

import socket from './socket.js'
/**
 * Connections
    onConnect : User connect to websocket
    onDisconnect : User disconnect from websocket
    onReconnect : User reconnect to websocket
    onConnectError : User connection error
    onConnectTimeout : User connection timeout reached
    onReconnectError : User reconnection error
 */

class clientEvents {
  constructor() {

  }

  async makeConnection() {
    socket.on('onConnect', () => {
      console.log("connected to the server ")
    })
  }

  /**
   * onConnectError : User connection error
   * @param {*this.usernameAlreadySelected} params 
   */
  async connectError(params) {
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        params.usernameAlreadySelected = false;
      }
    });
  }


  async getReadMsg(params) {
    socket.on("private message", ({
      content,
      from,
      to
    }) => {
      for (let i = 0; i < params.users.length; i++) {
        const user = params.users[i];
        const fromSelf = socket.userID === from;
        if (user.userID === (fromSelf ? to : from)) {
          user.messages.push({
            content,
            fromSelf,
          });
          if (user !== params.selectedUser) {
            user.hasNewMessages = true;
          }
          break;
        }
      }




    });
  }

  async readMsg(userId) {
    console.log("userId :", userId)
    let data = {
      userId: userId,
      messageId: "63a9aa745617e4e3f48e1072"
    }
    socket.emit('read-msg', (data))


  }


}


// export function disconnectEventHandler() {
//     console.log('disconnected');
// }
// export function reconnectEventHandler() {
//     console.log('User reconnect to websocket');
// }
// export function connectionErrorEventHandler() {
//      console.log('User connection error');
// }
// export function timeoutEventHandler() {
//     console.log('User connection timeout reached');
// }
// export function reconnectErrorEventHandler() {
//     console.log('User reconnection error');
// }



// export function closeEventHandler () {
//     console.log('close');
//     if (!retrying) {
//         retrying = true;
//         console.log('Reconnecting...');
//     }
//     setTimeout(makeConnection, timeout);
// }

export default clientEvents