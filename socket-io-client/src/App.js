import React, { Component, Fragment } from 'react';
import './App.css';
import Canvas from './canvas';
import CanvasReceiver from './canvasReceiver';
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
		<h3 style={{ textAlign: 'center' }}>Telestration</h3>
		<div className="main">
		  <div className="color-guide">
			<h5>Color Guide</h5>
			<div className="user user">User</div>
			<div className="user guest">Guest</div>
		  </div>
		  <div>
			<div>Your Board:</div>
			<Canvas socket={this.socket} />
		  </div>
		  <div>
		    <div>From Player:</div>
			<CanvasReceiver socket={this.socket}/>
		  </div>
		</div>
	  </Fragment>
	);
  }
}

export default App;