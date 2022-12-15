import conversation from '../models/conversationModel.js'

 const getConversations = async () => {
    try {
        const result = await conversation.find();
        if (result.length > 0) {
            console.log(result)
       
        }  
    } catch (err) {
       console.log(err)
    }
}

export default{getConversations}