require('dotenv').config();

const express = require("express");
const http = require("http");
const app = express();
var randomColor = require('randomcolor');

var cors = require('cors')
app.use(cors())

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const { start } = require('repl');
const gameNotStartedState = "GameNotStarted"
const gameStartedState = "GameStarted";
const gameEndedState = "GameEnded";
const showingResultsState = "ShowingResults";
var gameState = gameNotStartedState;
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
var userProps = [];
var userWordsMap = new Map();

var randomPictionaryWords = require('word-pictionary-list');
let interval;

function getApiAndEmit() {
  const timeNow = Math.round((new Date().getTime()) / 1000);
  var timePassed = timeNow - startTime;
  var timeRound = (timePassed % roundDurationSeconds);

  if (timeRound == 0 && timePassed != 0 && gameState === gameStartedState) {
    console.log("timerExpire emit: " + timeRound);
    io.sockets.emit("timerExpire", "");
    currentRound++;
  }

  if (timePassed >= (allClients.length * roundDurationSeconds) && gameState === gameStartedState) {
    console.log("Game ended! " + timeRound);
    gameState = gameEndedState;
    io.sockets.emit("gameEnded", "");
  }

  const response = {
    GameStarted: gameState === gameStartedState,
    CurrentRound: currentRound,
    TotalRounds: allClients.length,
    RoundTimeRemaining: roundDurationSeconds - timeRound,
  };

  // Emitting a new message. Will be consumed by the client
  io.sockets.emit("updateState", response);
}

interval = setInterval(getApiAndEmit, 1000);

function sendWordsOut(){
  allClients.forEach(element => {
    var randomWords = randomPictionaryWords({ exactly: 2 });
    var data = {
      word1: randomWords[0],
      word2: randomWords[1]
    };
    console.log("Element: " + element);
    userWordsMap[element] = data;
    io.to(element).emit('updateWord', data);
  });
}

function constructResults(userId, paintHistory, slideIndex) {
    var i = allClients.indexOf(userId);

    var drawings = [];
    for (j = 0; j < paintHistory.length; j++) {
      if (paintHistory[j].origin == i) {
        const paintData = {
          line: paintHistory[j].line,
          color: userProps.find(element => element.id === paintHistory[j].userId).color
        };
        drawings.push(paintData);
      }
    }

    var response = {
        name: userProps.find(element => element.id === userId).name,
        words: userWordsMap[userId],
        drawings: drawings,
        owner: userId,
        slideIndex: slideIndex
    }

    return response;
}

io.on("connection", (socket) => {
  console.log("New client connected: ", socket.id);
  allClients.push(socket.id);

  socket.on("startGame", data => {
    if (gameState !== gameStartedState) {
      gameState = gameStartedState;
      startTime = Math.round((new Date().getTime()) / 1000);
      this.paintHistory = [];
      currentRound = 0;
      io.sockets.emit("enterGame", "");
      io.sockets.emit("clearDrawings", "");
      sendWordsOut();
    }    
  }
  );

  socket.on("nameEntered", nameEntered => {
    var userProp = {
        id: socket.id,
        color: randomColor(),
        name: nameEntered,
    };
    userProps.push(userProp);

    io.sockets.emit("playerJoined", userProps);
    io.to(socket.id).emit("enterGame", "");
  }
  );

  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);

    for (i = 0; i < userProps.length; i++) {
        if (userProps[i].id == socket.id) {
            userProps.splice(i, 1);
            break;
        }
    }

    var i = allClients.indexOf(socket.id);
    allClients.splice(i, 1);
  });

  socket.on("paint", data => {
    var i = allClients.indexOf(data.userId);
    var nextIndex = i + 1;
    if (nextIndex >= allClients.length) {
      nextIndex = 0;
    }

    const thisUserProp = userProps.find(element => element.id === data.userId);
    var response = {
        color: thisUserProp.color,
        line: data.line
    };

    if (gameState === gameStartedState) {
      io.to(allClients[nextIndex]).emit('updatePaint', response);
    }

    // Find out original index
    var originIndex = i - (currentRound - 1);
    if (originIndex < 0) {
      originIndex = allClients.length + originIndex;
    }

    const hist = {
      line: data.line,
      userId: data.userId,
      origin: originIndex
    };

    this.paintHistory = this.paintHistory.concat(hist);
  });

  socket.on("showResult", userId => {
    if (gameState !== gameStartedState && this.paintHistory)
	{
        gameState = showingResultsState;
        var response = constructResults(userId, this.paintHistory, 0);
        io.sockets.emit('updateResult', response);
	}
  });

  socket.on("updateSlide", slideIndex => {
    io.sockets.emit('updateSlide', slideIndex);
  });
});


server.listen(port, () => console.log(`Listening on port ${port}`));