'use-strict'
/* eslint-disable no-unused-vars */
class simpleFetch {
  // get Conversation
  async getCnv()  {
    const response = await fetch("http://127.0.0.1:3000/members");
    const resData = await response.json();
    return resData;
  }


}

//create an instance 
const foued =new simpleFetch()

