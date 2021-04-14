import React, { Component } from 'react';
import { v4 } from 'uuid';

class CanvasReceiver extends Component {
	constructor(props) {
	  super(props);
	  this.socket = props.socket;
	}

	// Different stroke styles to be used for user and guest
	guestStrokeStyle = '#F0C987';
	line = [];	
	// v4 creates a unique id for each user. We used this since there's no auth to tell users apart
	userId = v4();
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
	  this.ctx = this.canvas.getContext('2d');	  
	  this.ctx.lineJoin = 'round';
	  this.ctx.lineCap = 'round';
	  this.ctx.lineWidth = 5;

	  this.socket.on("updatePaint", data => {
		 const { userId, line } = data;
		 if (userId !== this.userId) {
			line.forEach((position) => {
			  this.paint(position.start, position.stop, this.guestStrokeStyle);
			});
		 }
	  });
	}

	render() {
	  return (
		<canvas
		// We use the ref attribute to get direct access to the canvas element.
		  ref={(ref) => (this.canvas = ref)}
		  width={window.innerWidth * 0.4}
		  height={window.innerHeight * 0.8}
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