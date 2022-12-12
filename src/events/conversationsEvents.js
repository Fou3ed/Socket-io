import {
    EventEmitter
  } from 'node:events';
  import {  getConversation, getConversations } from '../controllers/conversationsController.js';
  class conversationEmitter extends EventEmitter {}
  /*
   *** onConversationStart : fired when the conversation created
   */

   /**
    * 
    */
 export const getConversationsEvent = new conversationEmitter();
  getConversationsEvent.on('getConversations', async () => {
   await getConversations()
  });
  
  export const getConversationByIdEvent = new conversationEmitter()
  getConversationByIdEvent.on('getConversationById',async(id)=>{
    await getConversation(id)
  })




  export default {getConversationsEvent,getConversationByIdEvent}
