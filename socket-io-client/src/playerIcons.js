import React, { Component } from 'react';
import socket from './socket'

class PlayerIcons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colorList: {}
        }
    }

    componentDidMount() {

        socket.on("updatePlayers", appUserColorMap => {
            this.setState({
                colorList: appUserColorMap,
            });
        });
    }
    render() {
        return (
            <>
                {
                    Object.entries(this.state.colorList).map(([color, user]) => {
                        const name = user === socket.id ? "It's You" : "Not You"
                        return <div className="user" style={{ background: color }}>{name}</div>
                    }

                    )
                }
            </>
        );
    }
}
export default PlayerIcons;