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
  constructor() {}

  /**
   ********************************* Server Events 
   */

  /**
   * onOpen : Websocket connection opened
   */
  async onOpen() {
    socket.on('onOpen', (event) => {
      socket.send('onOpen socket server', event)
    })
  }
  /**
   * onClose : Websocket connection closed
   */
  async onClose() {
    socket.on('onClose', () => {
      socket.send('socket been closed')
    })
  }

  /**
   * onError : websocket connection error
   */
  async onError() {
    socket.on('onError', () => {
      socket.send('websocket connection error')
    })
  }

  /**
   * ******************* Connections Events**********************************
   */

  /**
   * onConnect : User connect to websocket
   */
  async makeConnection() {
    socket.on('onConnect', () => {
      socket.send(" user connected to websocket")
    })
  }
  /**
   * onReconnect : user reconnect to websocket
   */
  async onReconnect() {
    socket.on('onReconnect', () => {
      socket.send('user reconnect to websocket')
    })
  }

  /**
   * onConnectTimeOut: user connection timeout reached
   */
  async onConnectTimeOut() {
    socket.on('onConnectTimeOut', () => {
      socket.send('user connection time out')
    })
  }

  /**
   * onReconnectError: user reconnection error
   */
  async onReconnectError() {
    socket.on('onReconnectError', () => {
      socket.send('user reconnection  Error')
    })
  }


  /**
   * onConnectError : user connection error
   *  @param {*this.usernameAlreadySelected} params 
   */
  async onConnectError(params) {
    socket.on('onConnectError', () => {
      socket.send('user connection error')
      console.log(params.usernameAlreadySelected)
      socket.on("connect_error", (err) => {
        if (err.message === "invalid username") {
          params.usernameAlreadySelected = false;
        }
      })
    })
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

  async readMsg() {
    let data = {
      userId: "6390b306dfb49a27e7e3c0bb",
      messageId: "63aea9384238af9d8eb1d91f"
    }
    socket.emit('read-msg', (data))
  }
  async onReadMsg() {
    socket.on("read-msg", (data) => {
      console.log(data)
    })
  }



  
  async getUser(data) {
    let nickname= data
    socket.emit('get-user', (nickname))
  }
  
  async onGetUser(){
    socket.on('get-user',(nickname)=>{
      console.log("nickname:",nickname)
    })
  }
}


export default clientEvents