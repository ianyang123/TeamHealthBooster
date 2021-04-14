import React, { Component, Fragment } from 'react';
import './App.css';
import Canvas from './canvas';
import CanvasReceiver from './canvasReceiver';
import GameState from './gameState';
import StartGame from './startGame';

class App extends Component {
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
			<Canvas/>
		  </div>
		  <div>
		    <div>From Player:</div>
			<CanvasReceiver/>
		  </div>

		  <GameState className = "gameState"/>
		  
		</div>
		<StartGame className = "startGame"/>
	  </Fragment>
	);
  }
}

export default App;