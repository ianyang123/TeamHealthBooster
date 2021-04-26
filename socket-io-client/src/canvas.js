  // canvas.js
  import React, { Component } from 'react';
  import socket from './socket'

  class Canvas extends Component {
    constructor(props) {
      super(props);
      this.onMouseDown = this.onMouseDown.bind(this);
      this.onMouseMove = this.onMouseMove.bind(this);
      this.endPaintEvent = this.endPaintEvent.bind(this);
      this.onTimerExpire = this.onTimerExpire.bind(this);
      this.onClearDrawings = this.onClearDrawings.bind(this);
      this.userStrokeStyle = props.userProps.reduce(function(fallback, current) {
        return current.id === socket.id ? current.color : fallback;
      }, '#EE92C2');
      this.canvasRef = React.createRef();
      this.state = {
          canvasWidth: window.innerWidth * 0.4,
          canvasHeight: window.innerHeight * 0.6,
      }
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
            canvasWidth: this.state.canvasWidth,
            canvasHeight: this.state.canvasHeight,
			userId: socket.id,
		};

		socket.emit("paint", body);
		this.line = [];
		this.ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
    }

    onTimerExpire(data) {
		this.sendPaintData();
    }

    onClearDrawings(data) {
        this.line = [];
        this.ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
    }

    componentDidMount() {
      // Here we set up the properties of the canvas element.
      this.ctx = this.canvasRef.current.getContext('2d');
      this.ctx.lineJoin = 'round';
      this.ctx.lineCap = 'round';
      this.ctx.lineWidth = 5;
	  
	  socket.on("timerExpire", this.onTimerExpire);
      socket.on("clearDrawings", this.onClearDrawings);
    }

    componentWillUnmount() {
        socket.off("timerExpire", this.onTimerExpire);
        socket.off("clearDrawings", this.onClearDrawings);
      }

    render() {
      return (
        <canvas
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
  export default Canvas;