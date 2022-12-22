'use-strict'
/* eslint-disable no-unused-vars */

class simpleFetch {
  /**
   * get all conversations 
   *  */
  async getCnvs() {
    const response = await fetch("http://127.0.0.1:3000/conversations");
    const resData = await response.json();
    return resData;
  }
  /**
   *  getConversation : get conversation data
   */
  async getCnv(id) {
    const response = await fetch(`http://127.0.0.1:3000/conversations/${id}`)
    const resData = await response.json();
    return resData;
  }
  /**
   * createConversation : create conversation.
   */
  async addCnv(data) {
    const response = await fetch(`http://127.0.0.1:3000/conversations`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resData = await response.json()
    return resData
  }
  /**
   * updateConversation : update conversation.
   */
  async putCnv(id, data) {
    const response = await fetch(`http://127.0.0.1:3000/conversations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resData = await response.json()
    return resData
  }
  /**
   * deleteConversation : delete conversation.
   */
  async deleteCnv(id) {
    const response = await fetch(`http://127.0.0.1:3000/conversations/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      },
    })
    const resData = await response.json()
    return resData
  }
  /**
   * getMembers : get members of conversation.
   */
  async getMembers() {
    const response = await fetch("http://127.0.0.1:3000/members");
    const resData = await response.json();
    return resData;
  }
  /**
   * getMember : get member data.
   */
  async getMember(id) {
    const response = await fetch(`http://127.0.0.1:3000/members/${id}`)
    const resData = await response.json();
    return resData;
  }
  /**
   * addMembers : add members to conversation.
   */

  async addMember(data) {
    const response = await fetch(`http://127.0.0.1:3000/members`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resData = await response.json()
    return resData
  }
  /**
   * updateMember : update member data.
   */
  async putMember(id, data) {
    const response = await fetch(`http://127.0.0.1:3000/conversations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resData = await response.json()
    return resData
  }
  /**
   * deleteMembers : delete members from conversation.
   */
  async deleteMember(id) {
    const response = await fetch(`http://127.0.0.1:3000/conversations/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      },
    })
    const resData = await response.json()
    return resData
  }
  /**
   * getMessages : get messages.
   */
  async getMsgs() {
    const response = await fetch("http://127.0.0.1:3000/message");
    const resData = await response.json();
    return resData;
  }
  /**
   * getMessage : get message data.
   */
  async getMsg(id) {
    const response = await fetch(`http://127.0.0.1:3000/message/${id}`)
    const resData = await response.json();
    return resData;
  }
  /**
   * createMessage : create message.
   */
  async addMsg(data) {
    const response = await fetch(`http://127.0.0.1:3000/message`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resData = await response.json()
    return resData
  }
  /**
   * updatedMessage : update message data.
   */
  async putMsg(id, data) {
    const response = await fetch(`http://127.0.0.1:3000/message/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resData = await response.json()
    return resData
  }
  /**
   * deleteMessage : delete message.
   */
  async deleteMsg(id) {
    const response = await fetch(`http://127.0.0.1:3000/message/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      },
    })
    const resData = await response.json()
    return resData
  }
  /**
   * markMessageAsRead : mark a message as read.
   */
  async readMsg(id, data) {
    const response = await fetch(`http://127.0.0.1:3000/message/read/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resData = await response.json()
    return resData
  }

  /**
   * markMessageAsDelivered : mark a message as delivered.
   */
  async deliverMsg(id, data) {
    const response = await fetch(`http://127.0.0.1:3000/message/deliver/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resData = await response.json()
    return resData
  }

  /**
   * getUnreadMessages : get unread messages.
   */
  async getUnReadMsg() {
    const response = await fetch("http://127.0.0.1:3000/message/unread/messages");
    const resData = await response.json();
    return resData;
  }

  /**
   * getUnreadMessages : get unread messages.
   */
  async getUnReadMsgCount() {
    const response = await fetch("http://127.0.0.1:3000/message/unread/messages/count");
    const resData = await response.json();
    return resData;
  }
  /**
   * getUsers : get users data.
   */
  async getUsers() {
    const response = await fetch("http://127.0.0.1:3000/users");
    const resData = await response.json();
    return resData;
  }
  /**
   * getUser : get user data.
   */
  async getUser(id) {
    const response = await fetch(`http://127.0.0.1:3000/users/${id}`)
    const resData = await response.json();
    return resData;
  }

  /**
   * createUser : create user.
   */
  async addUser(data) {
    const response = await fetch(`http://127.0.0.1:3000/users`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resData = await response.json()
    return resData
  }
  /**
   * updateUser : update user data.
   */
  async putUser(id, data) {
    const response = await fetch(`http://127.0.0.1:3000/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resData = await response.json()
    return resData
  }
  /**
   * deletedUser : delete user.
   */
  async deleteUser(id) {
    const response = await fetch(`http://127.0.0.1:3000/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      },
    })
    const resData = await response.json()
    return resData
  }
  /**
   * getUserStatus : get user status.
   */
  async getUserStatus(id) {
    const response = await fetch(`http://127.0.0.1:3000/users/status/${id}`)
    const resData = await response.json();
    return resData;
  }
  /**
   * getUsersOnline : get online users.
   */
  async getUsersOnline(id) {
    const response = await fetch(`http://127.0.0.1:3000/users/online/${id}`)
    const resData = await response.json();
    return resData;
  }
  /**
   * registerUser : log in a user.
   */
  async logIn(id) {
    const response = await fetch(`http://127.0.0.1:3000/users/login`)
    const resData = await response.json();
    return resData;
  }
  /**
   * UnregisterUser : Log out a user.
   */
  async logOut(id) {
    const response = await fetch(`http://127.0.0.1:3000/users/logout`)
    const resData = await response.json();
    return resData;
  }
  /**
   * banUser : ban a user.
   */
  async banUser(id, data) {
    const response = await fetch(`http://127.0.0.1:3000/users/ban/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resData = await response.json()
    return resData
  }
  /**
   * unbanUser
   */
  async unbanUser(id, data) {
    const response = await fetch(`http://127.0.0.1:3000/users/unban/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resData = await response.json()
    return resData
  }

}



//create an instance 
const foued = new simpleFetch()