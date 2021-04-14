  // gameState.js
  import React, { Component } from 'react';
  import socket from './socket'

  class StartGame extends Component {
    constructor(props) {
      super(props);

      this.button1 = React.createRef();
      // This binding is necessary to make `this` work in the callback
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        socket.emit("startGame", "ta da");
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