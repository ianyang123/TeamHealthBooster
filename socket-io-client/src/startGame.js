  // gameState.js
  import React, { Component } from 'react';
  import { v4 } from 'uuid';
  import socketIOClient from "socket.io-client";
  import Canvas from './canvas';
  class StartGame extends Component {
    constructor(props) {
      super(props);
	  //this.socket = socketIOClient("http://localhost:4001");
	  this.socket = props.socket;
      this.button1 = React.createRef();
      // This binding is necessary to make `this` work in the callback
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.socket.emit("startGame", "ta da");
      }

    componentDidMount() {
      console.log("Button  Mounted")

    }
    
    render() {
      return (
        <button onClick={this.handleClick}>
        Click me
      </button>
      );
    }
  }
  export default StartGame;