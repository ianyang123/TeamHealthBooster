require('dotenv').config();

const express = require("express");
const http = require("http");
const app = express();

var cors = require('cors')
app.use(cors())

const port = process.env.PORT || 4001;
const index = require("./routes/index");

app.use(index);

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: '*',
  }
});

let interval;

var allClients = [];

io.on("connection", (socket) => {
  console.log("New client connected: ", socket.id);
  allClients.push(socket.id);

  if (interval) {
    clearInterval(interval);

  }
  
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  
  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);
    clearInterval(interval);

    var i = allClients.indexOf(socket.id);
    allClients.splice(i, 1);
  });

  socket.on("paint", data => {
	  console.log(data);
	  io.sockets.emit('updatePaint', data);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  const gameState = {
    line: this.line,
    userId: this.userId,
  };
  // Emitting a new message. Will be consumed by the client
  console.log("Emitting state " + response.getDate());
  socket.emit("updateState", response); 
};

server.listen(port, () => console.log(`Listening on port ${port}`));