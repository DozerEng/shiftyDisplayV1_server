const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const rpio = require('rpio');


let port = 3000;
let soc; // variable used for sending messages through socket

// Handler for incoming messages from HTML page
function onConnect(socket) {
  socket.on("newDisplayFrame", handleNewDisplayFrame);
  socket.on("requestDisplayFrame", handleRequestDisplayFrame);
  soc = socket;
}

/* 
 * A new frame has been sent from the server
 * Send this new frame to the microcontroller
 */
function handleNewDisplayFrame (message) {
  console.log("Recieved Message: ", message);
}

function handleRequestDisplayFrame (message) {
  console.log("Recieved Message: ", message);
}

app.use(express.static('public'));
app.use("/images", express.static('images')); //url now requires /images/filename rather than just /filename

//Hanlding errors that make it past routes
app.use((req, res, next) => {   
  const error = new Error("Not found"); //message for error
  error.status = 404; //404 handler
  next(error);
});

//Handling of all errors
app.use((error, req, res, next) => {
  res.status(error.status || 500); //sending the error code
  res.json({
      error: {
          message: error.message //sending the error message
      }
  });
});

server.listen(port, () => {
  console.log(`Server running at https://localhost:${port}`);
});

io.sockets.on('connection', onConnect);
