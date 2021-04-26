import React, { Component } from 'react';
import socket from './socket'

class CanvasReceiver extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            canvasWidth: window.innerWidth * 0.4,
            canvasHeight: window.innerHeight * 0.6,
        }
      }

    // Different stroke styles to be used for user and guest
    line = [];
    userId = socket.id;
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

      socket.on("updatePaint", data => {
        this.ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);

        var {color, line, canvasWidth, canvasHeight} = data;
        var scaleFactorX = this.state.canvasWidth / canvasWidth;
        var scaleFactorY = this.state.canvasHeight / canvasHeight;
        line.forEach((position) => {
            const { offsetX, offsetY } = position.start;
            const { offsetX: x, offsetY: y } = position.stop;
            var scaledStart = { offsetX: offsetX * scaleFactorX, offsetY: offsetY * scaleFactorY};
            var scaledStop = { offsetX: x * scaleFactorX, offsetY: y * scaleFactorY};
            this.paint(scaledStart, scaledStop, color);
        });
      });

      socket.on("gameEnd", data => {
		  console.log("game end");
          this.ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
      });

      socket.on("clearDrawings", data => {
        this.line = [];
        this.ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
    });
    }

    render() {
      return (
        <canvas
        // We use the ref attribute to get direct access to the canvas element.
          ref={this.canvasRef}
          width={this.state.canvasWidth}
          height={this.state.canvasHeight}
          style={{ background: 'white', margin: '5px', border: '2px solid #000000' }}
          onMouseDown={this.onMouseDown}
          onMouseLeave={this.endPaintEvent}
          onMouseUp={this.endPaintEvent}
          onMouseMove={this.onMouseMove}
        />
      );
    }
}
export default CanvasReceiver;