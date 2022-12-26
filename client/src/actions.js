/* eslint-disable no-undef */
// Get Request
button1.addEventListener('click', addMsg);

function addMsg() {
  
  foued.addMsg()
  .then((data) => {
    console.log(data)
    return data;
  })
}

