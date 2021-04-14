  // gameState.js
  import React, { Component } from 'react';
  import { v4 } from 'uuid';
  import socketIOClient from "socket.io-client";
  import Canvas from './canvas';
  class GameState extends Component {
    constructor(props) {
      super(props);
	  this.socket = props.socket;
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

      this.socket.on("updateState", response => {
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