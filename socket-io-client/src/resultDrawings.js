import React, { Component } from 'react';
import CanvasViewer from './canvasViewer';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

class ResultDrawings extends Component {

    constructor(props) {
        super(props);
        this.carousel = React.createRef();
    }

    slideTo(index) {
        if (this.carousel.current) {
            this.carousel.current.slideTo(index);
        }
    }

    render() {
        if (this.props.drawings && this.props.drawings.length > 0) {
            return <AliceCarousel 
            key={this.props.ownerId}
            ref={this.carousel}
            items={this.props.drawings}
            responsive={{
                0: { items: 1 },
                1024: { items: 1 },
              }}
            onSlideChanged={this.props.slideChanged}
            disableDotsControls={this.props.userId !== this.props.ownerId}
            disableButtonsControls={this.props.userId !== this.props.ownerId}
            mouseTracking={this.props.userId === this.props.ownerId}
            touchTracking={this.props.userId === this.props.ownerId}
            touchMoveDefaultEvents={this.props.userId === this.props.ownerId}
            />;
        }
        else { 
            return <CanvasViewer/>;
        }
    }
}
export default ResultDrawings;
