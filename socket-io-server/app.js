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

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
  socket.on("paint", () => {
	  console.log("got data");
  });
});

app.post('/paint', (req, res) => {
  
  //io.sockets.emit('FromAPI', "test");
  const { userId, line } = res;
  console.log(req.body);
  
  //var clientsList = io.sockets.adapter.rooms[room];
  //var numClients = clientsList.length;
  //var clients = io.sockets.clients();
  //for (var client in clients) {
	//console.log("pushing");
  //}

  //socket.emit("FromAPI", response);
  //socket.emit('painting', 'draw', req.body);
  //res.json(req.body);
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));