
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
class events{
    makeConnection(){
        
    }
}

class clientEvents extends events{
    constructor(){
        super()
    }
    
   async makeConnection() {
        socket.on('onConnect',()=>{
            console.log("connected to the server ")
        })
    }

    async readMsg(userId){  
        let data ={
            userId:userId,
            messageId:"63a9aa745617e4e3f48e1072"
          }
          socket.on('read-msg',(data)=>{
            console.log("hedhy l on",data)
          })
          socket.emit('read-msg',(data))
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