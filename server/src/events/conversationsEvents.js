import {
  EventEmitter
} from 'node:events';
import {
  getConversation,
  getConversations,
  postConversation,
  putConversation
} from '../controllers/conversationsController.js';

class conversationEmitter extends EventEmitter {}




/**
 * getConversationsEvent : get all the conversations 
 */
export const getConversationsEvent = new conversationEmitter();
getConversationsEvent.on('getConversations', async () => {
  await getConversations()
});
/**
 * getConversationByIdEvent :  get a conversation By Id 
 */
export const getConversationByIdEvent = new conversationEmitter()
getConversationByIdEvent.on('getConversationById', async (id) => {
  await getConversation(id)
})


/*
 ** onConversationStart : fired when the conversation created
 */
export const onConversationStart = new conversationEmitter()
onConversationStart.on('addConversation', async (req) => {
  await postConversation(req)
})

/**
 * onConversationUpdated
 */
export const onConversationUpdated = new conversationEmitter()
onConversationUpdated.on('putConversation', async (req) => {
  await putConversation(req)
})

/**
 * 
 */


export default {
  getConversationsEvent,
  getConversationByIdEvent
}