import React, { Component, Fragment } from 'react';
import './App.css';
import Canvas from './canvas';
import CanvasReceiver from './canvasReceiver';
import socketIOClient from "socket.io-client";
import GameState from './gameState';
import StartGame from './startGame';
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
		<div className="state">
		</div>
		<div className="state">
		</div>
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

		  <GameState className = "gameState" socket={this.socket}/>
		  
		</div>
		<StartGame className = "startGame" socket={this.socket}/>
	  </Fragment>
	);
  }
}

export default App;