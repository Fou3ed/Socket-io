/* eslint-disable no-unused-vars */
/* abstract */
class MessageStore {
    saveMessage(message) {}
    findMessagesForUser(userID) {}
        
}

class InMemoryMessageStore extends MessageStore {
    constructor() {
        super();
        this.messages = [];

    }
    saveMessage(message) {
        this.messages.push(message);
        // eslint-disable-next-line no-undef
    }
    findMessagesForUser(userID) {
        return this.messages.filter(
            ({
                from,
                to
            }) => from === userID || to === userID
        );
    }
}

export default InMemoryMessageStore