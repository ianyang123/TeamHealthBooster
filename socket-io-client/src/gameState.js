// gameState.js
import React, { Component } from 'react';
import socket from './socket'

  class GameState extends Component {
    constructor(props) {
      super(props);
      this.wordChoice = "";

      this.state = {
          timerLabel: "Click Start Game to Begin!",
          roundObj: "",
          wordChoice: ""
      }

    }

    componentDidMount() {    
      console.log("GameState Mounted")

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