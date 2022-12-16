/* eslint-disable no-undef */

// Get Request
button1.addEventListener('click', getReq);

function getReq() {
    foued.getCnv()
    .then((data) => {
      console.log(data)
      return data;
    })
 
    }