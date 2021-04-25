import React, { Component } from 'react';

class CanvasViewer extends Component {

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            canvasWidth: window.innerWidth * 0.4,
            canvasHeight: window.innerHeight * 0.6,
        }
      }

    prevPos = { offsetX: 0, offsetY: 0 };

    paint(prevPos, currPos, strokeStyle) {
      const { offsetX, offsetY } = currPos;
      const { offsetX: x, offsetY: y } = prevPos;

      this.ctx.beginPath();
      this.ctx.strokeStyle = strokeStyle;
      // Move the the prevPosition of the mouse
      this.ctx.moveTo(x, y);
      // Draw a line to the current position of the mouse
      this.ctx.lineTo(offsetX, offsetY);
      // Visualize the line using the strokeStyle
      this.ctx.stroke();
      this.prevPos = { offsetX, offsetY };
    }

    componentDidMount() {
      // Here we set up the properties of the canvas element.
      this.ctx = this.canvasRef.current.getContext('2d');
      this.ctx.lineJoin = 'round';
      this.ctx.lineCap = 'round';
      this.ctx.lineWidth = 5;

      this.ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
        if (this.props.drawing) {
            this.props.drawing.line.forEach((position) => {
                this.paint(position.start, position.stop, this.props.drawing.color);
            });
        }
    }

    render() {
      return (
        <canvas
        // We use the ref attribute to get direct access to the canvas element.
          ref={this.canvasRef}
          width={this.state.canvasWidth}
          height={this.state.canvasHeight}
          style={{ background: 'white', margin: '5px', border: '2px solid #000000' }}
        />
      );
    }
}
export default CanvasViewer;
