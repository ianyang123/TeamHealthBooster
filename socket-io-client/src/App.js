import React, { Component, Fragment } from 'react';
import './App.css';
import Canvas from './canvas';
import socketIOClient from "socket.io-client";


class App extends Component {
	constructor(){
	super();
	let socket = socketIOClient("http://localhost:4001");
	this.socket = socket;
 	}
	
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
		  <Canvas socket={this.socket} />
		</div>
	  </Fragment>
	);
  }
}

export default App;