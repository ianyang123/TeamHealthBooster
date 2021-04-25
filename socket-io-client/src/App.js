import React, { Component, Fragment } from 'react';
import './App.css';
import Canvas from './canvas';
import CanvasReceiver from './canvasReceiver';
import CanvasViewer from './canvasViewer';
import CanvasEveryone from './canvasEveryone';
import GameState from './gameState';
import StartGame from './startGame';
import ShowResult from './showResult';
import PlayerIcons from './playerIcons';
import socket from './socket';
import ResultDrawings from './resultDrawings';

class App extends Component {

    constructor(props) {
    super(props);

    this.resultDrawings = React.createRef();

    this.state = {
        nameEntered: "",
        gameState: "EnterName",
        userProps: {},
        drawings: [],
        resultsHeader: "Click Show Results to share your results!",
        currentResultsOwner: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.slideChanged = this.slideChanged.bind(this);
    }

    handleChange(event) {
        this.setState({nameEntered: event.target.value});
    }
    
    handleSubmit(event) {
        socket.emit("nameEntered", this.state.nameEntered);
        event.preventDefault();
    }

    slideChanged(event) {
        if (socket.id === this.state.currentResultsOwner) {
            socket.emit("updateSlide", event.slide)
        }
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

        socket.on("gameEnded", response => {
            this.setState({
                gameState: "GameEnded",
                drawings: [],
                resultsHeader: "Click Show Results to share your results!",
            });
        });

        socket.on("updateResult", response => {

            var {name, words, drawings, owner} = response;
            var canvases = [];
            drawings.forEach(element => {
              canvases.push(<CanvasViewer
                  drawing={element}
                />)
            });
            this.setState({
              drawings: canvases,
              resultsHeader: name + "'s results: " + words.word1 + " OR " + words.word2,
              currentResultsOwner: owner
            });
        });

        socket.on("updateSlide", slideIndex => {
            if (this.resultDrawings.current && socket.id !== this.state.currentResultsOwner) {
                this.resultDrawings.current.slideTo(slideIndex);
            }
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
                </div>
                <div className="draw-area">
                    <div>Your Board:</div>
                    <Canvas
                        userProps={this.state.userProps}
                    />
                </div>
                <div className="draw-area">
                    <div>From Player:</div>
                    <CanvasReceiver/>
                </div>
                </div>
            </Fragment>
            );
    }
    else if (this.state.gameState === "GameEnded")
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
                <div className="draw-area">
                    <div>Draw here for everyone to see!</div>
                    <CanvasEveryone
                        userProps={this.state.userProps}
                    />
                </div>
                <div className="draw-area">
                    <div dangerouslySetInnerHTML={{ __html: this.state.resultsHeader }} />
                    <ResultDrawings
                        ref={this.resultDrawings}
                        drawings={this.state.drawings}
                        slideChanged={this.slideChanged}  
                        ownerId={this.state.currentResultsOwner}
                        userId={socket.id}
                    />
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