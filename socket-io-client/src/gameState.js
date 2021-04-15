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
           this.textarea.textContent = "Time Remaining in Round:" + response;
           console.log(response)
        console.log("Saw updateState");
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
            <textarea
            // We use the ref attribute to get direct access to the canvas element.
            ref={ (ref) => (this.textarea = ref) }
            style={{ background: 'yellow' }}
            />
            <td dangerouslySetInnerHTML={{__html: this.state.word}} />
          </div>
      );
    }
  }
  export default GameState;