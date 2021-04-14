require('dotenv').config();

const express = require("express");
const http = require("http");
const app = express();

var cors = require('cors')
app.use(cors())

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const { start } = require('repl');
var isGameStarted = false;
var timeNow;
var startTime;
var roundDurationSeconds = 10;
app.use(index);

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: '*',
  }
});



var allClients = [];

let interval;

function getApiAndEmit() {
  const timeNow =  Math.round((new Date().getTime())/1000);
  var timePassed = timeNow - startTime;
  
  var timeRound = (timePassed % roundDurationSeconds);
  console.log("timeRound: "+ timePassed);
  if (timeRound == 0)
  {
    console.log("TIME DONE: "+ timePassed);
    io.sockets.emit("timerExpire",""); 
  }
  const gameState = {
    line: this.line,
    userId: this.userId,
  };
  // Emitting a new message. Will be consumed by the client
  //console.log("Emitting state " + response.getDate());
  io.sockets.emit("updateState", timeRound); 
}


interval = setInterval(getApiAndEmit, 1000);

io.on("connection", (socket) => {
  console.log("New client connected: ", socket.id);
  allClients.push(socket.id);

  // if (interval) {
  //   clearInterval(interval);

  // }
  

  
  // socket.on("startGame", data => {
	//   console.log(
  //     "STARTING GAME"
  //   );
  // }
  // );
  socket.on("startGame", data => {
	  console.log(
      "SERVER SEES START GAME CLICK"
    );

    isGameStarted = true;
    startTime =  Math.round((new Date().getTime())/1000);
    console.log("Game starting at " + startTime);


  }
  );

  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);
    clearInterval(interval);

    var i = allClients.indexOf(socket.id);
    allClients.splice(i, 1);
  });

  socket.on("paint", data => {
	  //console.log(data);
      console.log(allClients)
      var i = allClients.indexOf(data.userId);
      var nextIndex = i + 1;
      if (nextIndex >= allClients.length)
      {
          nextIndex = 0;
      }
      console.log("nextIndex: " + nextIndex);
      io.to(allClients[nextIndex]).emit('updatePaint', data);
  });
});


server.listen(port, () => console.log(`Listening on port ${port}`));