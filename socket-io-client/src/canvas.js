  // canvas.js
  import React, { Component } from 'react';
  import socket from './socket'

  class Canvas extends Component {
    constructor(props) {
      super(props);
      this.onMouseDown = this.onMouseDown.bind(this);
      this.onMouseMove = this.onMouseMove.bind(this);
      this.endPaintEvent = this.endPaintEvent.bind(this);
      this.userStrokeStyle = props.userProps.reduce(function(fallback, current) {
        return current.id == socket.id ? current.color : fallback;
      }, '#EE92C2');
    }

    isPainting = false;
	line = [];
    prevPos = { offsetX: 0, offsetY: 0 };

    onMouseDown({ nativeEvent }) {
      const { offsetX, offsetY } = nativeEvent;
      this.isPainting = true;
      this.prevPos = { offsetX, offsetY };
    }

    onMouseMove({ nativeEvent }) {
      if (this.isPainting) {
        const { offsetX, offsetY } = nativeEvent;
        const offSetData = { offsetX, offsetY };
        // Set the start and stop position of the paint event.
        const positionData = {
          start: { ...this.prevPos },
          stop: { ...offSetData },
        };
        // Add the position to the line array
        this.line = this.line.concat(positionData);
        this.paint(this.prevPos, offSetData, this.userStrokeStyle);
      }
    }

    endPaintEvent({ nativeEvent }) {
      if (this.isPainting) {
        const { offsetX, offsetY } = nativeEvent;
        if (this.prevPos.offsetX === offsetX && this.prevPos.offsetY === offsetY)
        {
            const offSetData = { offsetX, offsetY };
            const positionData = {
                start: { ...this.prevPos },
                stop: { ...offSetData },
              };
              // Add the position to the line array
              this.line = this.line.concat(positionData);
              this.paint(this.prevPos, offSetData, this.userStrokeStyle);
        }
        this.isPainting = false;
      }
    }
    
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

    async sendPaintData() {
		const body = {
			line: this.line,
			userId: socket.id,
		};

		socket.emit("paint", body);
		this.line = [];
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    componentDidMount() {
      // Here we set up the properties of the canvas element.
      this.ctx = this.canvas.getContext('2d');
      this.ctx.lineJoin = 'round';
      this.ctx.lineCap = 'round';
      this.ctx.lineWidth = 5;
	  
	  socket.on("timerExpire", data => {
		this.sendPaintData();
    });
    }

    render() {
      return (
		<canvas
		  // We use the ref attribute to get direct access to the canvas element. 
		  ref={(ref) => (this.canvas = ref)}
		  width={window.innerWidth * 0.4}
		  height={window.innerHeight * 0.6}
		  style={{ background: 'white', margin: '5px', border: '2px solid #000000' }}
		  onMouseDown={this.onMouseDown}
		  onMouseLeave={this.endPaintEvent}
		  onMouseUp={this.endPaintEvent}
		  onMouseMove={this.onMouseMove}
		/>
      );
    }
  }
  export default Canvas;