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
var currentRound = 0;
var roundDurationSeconds = 10;
app.use(index);

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: '*',
  }
});

var allClients = [];
var paintHistory = [];
var randomWords = require('random-words');
var round = 1;
let interval;

function getApiAndEmit() {
  const timeNow =  Math.round((new Date().getTime())/1000);
  var timePassed = timeNow - startTime;

  var timeRound = (timePassed % roundDurationSeconds);

  if (timeRound == 0 && timePassed != 0 && isGameStarted)
  {
    console.log("timerExpire emit: "+ timeRound);
    io.sockets.emit("timerExpire",""); 
    currentRound++;
  }

  if(timePassed >= (allClients.length * roundDurationSeconds) && isGameStarted)
  {
    console.log("Game ended!"+ timeRound);
    isGameStarted = false;
    io.sockets.emit("gameEnd",""); 
  }
  
  const gameState = {
    GameStarted: isGameStarted,
    CurrentRound: currentRound,
    TotalRounds: allClients.length ,
    RoundTimeRemaining: roundDurationSeconds-timeRound,
  };
  
  // Emitting a new message. Will be consumed by the client
  io.sockets.emit("updateState", gameState); 
}

interval = setInterval(getApiAndEmit, 1000);

io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id);
    allClients.push(socket.id);

    socket.on("startGame", data => {
        console.log(
          "SERVER SEES START GAME CLICK"
        );

        if(!isGameStarted)
        {
          isGameStarted = true;
          startTime =  Math.round((new Date().getTime())/1000);
          this.paintHistory = [];
		  currentRound = 0;
        }

        console.log("Game starting at " + startTime);

        const response = {
            word: randomWords(),
        };

        socket.emit('updateWord', response);
    }
  );

  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);

    var i = allClients.indexOf(socket.id);
    allClients.splice(i, 1);
  });

  socket.on("paint", data => {
      var i = allClients.indexOf(data.userId);
      var nextIndex = i + 1;
      if (nextIndex >= allClients.length)
      {
          nextIndex = 0;
      }

      io.to(allClients[nextIndex]).emit('updatePaint', data);

	  // Find out original index
	  var originIndex = i-(round - 1);
	  if (originIndex < 0)
	  {
		  originIndex = allClients.length + originIndex;
	  }
	  
	  console.log("index: " + i + ", original : " + originIndex);
	  
	  const hist = {
			line: data.line,
			userId: data.userId,
			origin: originIndex
		};
		
	  this.paintHistory = this.paintHistory.concat(hist);
  });
  
  socket.on("showResult", data => {
	  console.log(this.paintHistory);
	  var i = allClients.indexOf(data);
	  
	  for (j = 0; j < this.paintHistory.length; j++) {
		if (this.paintHistory[j].origin == i)
		{
			const paintData = {
				line: this.paintHistory[j].line,
				userId: this.paintHistory[j].userId
			};
			io.sockets.emit('updateResult', paintData);
			this.paintHistory.splice(j, 1);
			break;
		}
	  }
  });
});


server.listen(port, () => console.log(`Listening on port ${port}`));