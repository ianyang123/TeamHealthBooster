import React, { Component, Fragment } from 'react';
import './App.css';
import Canvas from './canvas';
import CanvasReceiver from './canvasReceiver';
import GameState from './gameState';
import StartGame from './startGame';
import ShowResult from './showResult';
import PlayerIcons from './playerIcons';
import socket from './socket';

class App extends Component {

    constructor(props) {
    super(props);

    this.state = {
        nameEntered: "",
        gameState: "EnterName",
        userProps: {},
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({nameEntered: event.target.value});
    }
    
    handleSubmit(event) {
        socket.emit("nameEntered", this.state.nameEntered);
        event.preventDefault();
    }

    componentDidMount() {

        socket.on("enterGame", response => {
            this.setState({
                gameState: "InGame",
            });
        });

        socket.on("playerJoined", userProps => {
            this.setState({
                userProps: userProps,
            });
        });
    }

render() {

    if (this.state.gameState === "EnterName")
    {
        return (
            <div className="topLeft">
            <form onSubmit={this.handleSubmit}>
                <label>
                    <span>Name: </span>
                </label>

                <input type="text" value={this.state.nameEntered} onChange={this.handleChange} />
                <input type="submit" value="Join Game!" className="button" />
            </form>
            </div>
            );
    }
    else if (this.state.gameState === "InGame")
    {
        return (
            <Fragment>
                <h3 style={{ textAlign: 'center' }}>Telestration</h3>
        
                <div className="state">
                <GameState className="gameState"/>
                </div>
        
                <div className="main">
                <div className="color-guide">
                    <h5>Players</h5>
                    <PlayerIcons
                        userProps={this.state.userProps}
                    />
                    <StartGame className="startGame"/>
                    <ShowResult className="showResult"/>
                </div>
                <div>
                    <div>Your Board:</div>
                    <Canvas
                        userProps={this.state.userProps}
                    />
                </div>
                <div>
                    <div>From Player:</div>
                    <CanvasReceiver/>
                </div>
                </div>
            </Fragment>
            );
    }
    else {
        return (<h3 style={{ textAlign: 'center' }}>Unknown State</h3>);
    }
}
}

export default App;