<template>
  <div id="app">
    <select-username
      v-if="!usernameAlreadySelected"
      @input="onUsernameSelection"
    />
    <chat v-else />
  </div>
</template>
<script>
import SelectUsername from "./components/SelectUsername.vue";
import Chat from "./components/Chat";
import socket from "./socket";
import clientEvents from './eventFunctions.js'
const foued = new clientEvents()
export default {
  name: "App",
  components: {
    Chat,
    SelectUsername,
  },
  data() {
    return {
      usernameAlreadySelected: false,
    };
  },
  methods: {
    onUsernameSelection(username) {
      this.usernameAlreadySelected = true;
      socket.auth = { username };
      foued.getUser({username})
      socket.connect();
      
    },

  }, 
  created() {
    foued.onOpen()
    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      this.usernameAlreadySelected = true;
      socket.auth = { sessionID };
      socket.connect()
    }

    
    foued.makeConnection()

    socket.on("session", ({ sessionID, userID }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      socket.userID = userID;
      localStorage.setItem("userID", userID);

    });


   // socket.emit("deleted-msg",({userID: localStorage.getItem("userID")}))
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        this.usernameAlreadySelected = false;
      }
    });
  }, 
  destroyed() {
    socket.off("connect_error");
  },
};
</script>

<style>
body {
  margin: 0;
}

@font-face {
  font-family: Lato;
  src: url("/fonts/Lato-Regular.ttf");
}

#app {
  font-family: Lato, Arial, sans-serif;
  font-size: 14px;
}
</style>
