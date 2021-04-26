import React, { Component } from 'react';

class PlayerIcons extends Component {

    render() {
        return (
            <>
                {
                    this.props.userProps.map(prop => {
                        return <div key={prop.id} className="user" style={{ background: prop.color }}>{prop.name}</div>
                    }
                    )
                }
            </>
        );
    }
}
export default PlayerIcons;