  // gameState.js
  import React, { Component } from 'react';
  import socket from './socket'

  class GameState extends Component {
    constructor(props) {
      super(props);
      this.textarea1 = React.createRef();
      this.canvas1 = React.createRef();

      this.state = {
          word: ""
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
          this.textarea.textContent = "Click Start Game to Begin!";
        }
        else
        {
          this.textarea.textContent = 
          "Round: " + response.CurrentRound + " of " + response.TotalRounds + " Time Remaining: " + response.RoundTimeRemaining;
        }
        console.log(response)
     });

      socket.on("updateWord", response => {
          console.log("got " + response.word);
           this.setState({
              word: "Your word: " + response.word,
           });
     });
    }
      
    render() {
      return (
          <div>

            <h2
            // We use the ref attribute to get direct access to the canvas element.
            ref={ (ref) => (this.textarea = ref) }
            style={{ textAlign: 'center' }}
            />

            <h4 dangerouslySetInnerHTML={{__html: this.state.word}} 
            style={{ textAlign: 'center' }}
            />

          </div>
      );
    }
  }
  export default GameState;