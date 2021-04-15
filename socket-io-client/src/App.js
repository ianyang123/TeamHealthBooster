import React, { Component, Fragment } from 'react';
import './App.css';
import Canvas from './canvas';
import CanvasReceiver from './canvasReceiver';
import GameState from './gameState';
import StartGame from './startGame';
import ShowResult from './showResult';

class App extends Component {
  render() {
	return (
	  <Fragment>
		<h3 style={{ textAlign: 'center' }}>Telestration</h3>

		<div className="state">
		<GameState className="gameState"/>
		</div>

		<div className="main">
		  <div className="color-guide">
			<h5>Color Guide</h5>
			<div className="user user">User</div>
			<div className="user guest">Guest</div>
			<StartGame className="startGame"/>
			<ShowResult className="showResult"/>
		  </div>
		  <div>
			<div>Your Board:</div>
			<Canvas/>
		  </div>
		  <div>
		    <div>From Player:</div>
			<CanvasReceiver/>
		  </div>
		</div>
	  </Fragment>
	);
  }
}

export default App;