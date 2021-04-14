  // gameState.js
  import React, { Component } from 'react';
  import socket from './socket'

  class GameState extends Component {
    constructor(props) {
      super(props);
      this.textarea1 = React.createRef();
      this.canvas1 = React.createRef();
      
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
           this.textarea.textContent = response;
           console.log(response)
        console.log("Saw updateState");
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

          </div>
      );
    }
  }
  export default GameState;