//import React, { useState, useEffect } from "react";
import React, { Component, Fragment } from 'react';
import Canvas from './canvas';
//import socketIOClient from "socket.io-client";
//const ENDPOINT = "http://localhost:4001";


class App extends Component {
  render() {
    return (
      <Fragment>
        <h3 style={{ textAlign: 'center' }}>Dos Paint</h3>
        <div className="main">
          <div className="color-guide">
            <h5>Color Guide</h5>
            <div className="user user">User</div>
            <div className="user guest">Guest</div>
          </div>
          <Canvas />
        </div>
      </Fragment>
    );
  }
}

export default App;