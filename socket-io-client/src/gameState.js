// gameState.js
import React, { Component } from 'react';
import socket from './socket'
import colors from './colors';

  class GameState extends Component {
    constructor(props) {
      super(props);
      this.textarea1 = React.createRef();
      this.canvas1 = React.createRef();
      this.wordChoice = "";

      this.state = {
          timerLabel: "Click Start Game to Begin!",
          roundObj: "",
          wordChoice: ""
      }

    }

    componentDidMount() {
      // Here we set up the properties of the element.
    //   this.textarea.width = 500;
    //   this.textarea.height = 100;
    //   this.textarea.text = "HELLO";
    //   this.textarea.background = "blue";
    
      console.log("GameState Mounted")
      //this.textarea.textContent = "Round 1: Remaining Time: 60";

    socket.on("updateState", response => {
        if(!response.GameStarted)
        {
        this.setState({
          timerLabel: "Click Start Game to Begin!",
          roundObj: ""
        });
      }
        else
        {
        var objective = "";
        if (response.CurrentRound === 0 && response.TotalRounds % 2 === 0) {
          objective = "Pick a word and draw it out! ";
          this.setState({
            wordChoice: this.wordChoice
          });
        }
        else if (response.CurrentRound === 0 && response.TotalRounds % 2 !== 0) {
          objective = "Pick a word and write it on your board!";
          this.setState({
            wordChoice: this.wordChoice
          });
        }
        else if ((response.CurrentRound % 2 === 0 && response.TotalRounds % 2 === 0) ||
          (response.CurrentRound % 2 !== 0 && response.TotalRounds % 2 !== 0)) {
          objective = "Draw!";
          this.setState({
            wordChoice: ""
          });
        }
        else if ((response.CurrentRound % 2 === 0 && response.TotalRounds % 2 !== 0) ||
          (response.CurrentRound % 2 !== 0 && response.TotalRounds % 2 === 0)) {
          objective = "Guess!";
          this.setState({
            wordChoice: ""
          });
        }
        this.setState({
          timerLabel: "Round: " + (response.CurrentRound + 1) + " of " + response.TotalRounds + " Time Remaining: " + response.RoundTimeRemaining,
          roundObj: objective
        });
        }
     });

        socket.on("updateWord", data => {
          this.wordChoice = "Your words: " + data.word1 + ", " + data.word2;
        });
        
        socket.on("userAdded", appUserColorMap => {
          for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
            let color = colors[colorIndex];
            let isCurrentColorInUse = appUserColorMap.hasOwnProperty(color);
            if (!isCurrentColorInUse) {
              appUserColorMap[color] = socket.id;
              break;
            }
          }
          socket.emit("userColorAssigned", appUserColorMap);
        });


      }

      render() {
        return (
          <div>

            <h2
              dangerouslySetInnerHTML={{ __html: this.state.timerLabel }}
              style={{ textAlign: 'center' }}
            />

            <h3 dangerouslySetInnerHTML={{ __html: this.state.roundObj }}
              style={{ textAlign: 'center', whiteSpace: 'nowrap' }}
            />

            <h3 dangerouslySetInnerHTML={{ __html: this.state.wordChoice }}
              style={{ textAlign: 'center', whiteSpace: 'nowrap' }}
            />
          </div>
        );
      }
    }
export default GameState;