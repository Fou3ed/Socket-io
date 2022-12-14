import {
    EventEmitter
  } from 'node:events';
  import {
    
    getConversations,
    
  } from '../controllers/conversationsController.js';


export const printMsg= async function(){
console.log("printMSG")


}
  


class conversationEmitter extends EventEmitter {}

export const getCnv = (function () {
    console.log("getCnv")
  const getConversationsEvent = new conversationEmitter();
   getConversationsEvent.on('getConversations', async () => {
    await getConversations()
   });

})
