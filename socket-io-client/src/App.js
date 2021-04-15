import React, { Component, Fragment } from 'react';
import './App.css';
import Canvas from './canvas';
import CanvasReceiver from './canvasReceiver';
import GameState from './gameState';
import StartGame from './startGame';
import ShowResult from './showResult';
import PlayerIcons from './playerIcons';

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
			<h5>Players</h5>
			<PlayerIcons/>
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