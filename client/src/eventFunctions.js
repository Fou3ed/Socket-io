
let timeout = 1000;
let retrying = false;


/**
 * Connections
    onConnect : User connect to websocket
    onDisconnect : User disconnect from websocket
    onReconnect : User reconnect to websocket
    onConnectError : User connection error
    onConnectTimeout : User connection timeout reached
    onReconnectError : User reconnection error
 */
export function makeConnection () {
    console.log("connected to the server")
}
export function disconnectEventHandler() {
    console.log('connected');
    retrying = false;
}
export function reconnectEventHandler() {
    console.log('User reconnect to websocket');
}
export function connectionErrorEventHandler() {
     console.log('User connection error');
}
export function timeoutEventHandler() {
    console.log('User connection timeout reached');
}
export function reconnectErrorEventHandler() {
    console.log('User reconnection error');
}



export function closeEventHandler () {
    // console.log('close');
    if (!retrying) {
        retrying = true;
        console.log('Reconnecting...');
    }
    setTimeout(makeConnection, timeout);
}

