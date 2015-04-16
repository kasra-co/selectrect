"use strict";

var React = require( "react" );
var _ = require( "lodash" );
var Mask = require( "./mask" );
var Handle = require( "./handle" );

var SelectRect = module.exports = React.createClass({
	displayName: "SelectRect",

	propTypes: {
		backgroundSrc: React.PropTypes.string.isRequired,
		maskColor: React.PropTypes.string,
		updateSelection: React.PropTypes.func.isRequired,
		initialSelection: React.PropTypes.arrayOf( React.PropTypes.number ),
		minSize: React.PropTypes.arrayOf( React.PropTypes.number ).isRequired,
		aspectRatio: React.PropTypes.number
	},

	render: function() {
		return (
			<div
				onMouseUp={ this.endDragPan }
				style={{
					position: "relative",
					display: "inline-block"
				}}>
				<img src={ this.props.backgroundSrc } ref={ "image" }/>
				{ this.renderMask( this.getTopRect() )}
				{ this.renderMask( this.getLeftRect() )}
				{ this.renderWindow( this.getCenterRect() )}
				{ this.renderMask( this.getRightRect() )}
				{ this.renderMask( this.getBottomRect() )}
				{ this.renderHandles() }
			</div>
		); // TODO: center pan & crosshair
	},

	getDefaultProps: function() {
		return {
			initialSelection: [ 0, 0, "100%", "100%" ],
			maskColor: "rgba( 0, 0, 0, 0.25 )"
		};
	},

	getInitialState: function() {
		return {
			x0: this.props.initialSelection[ 0 ],
			y0: this.props.initialSelection[ 1 ],
			x1: this.props.initialSelection[ 0 ] + this.props.initialSelection[ 2 ],
			y1: this.props.initialSelection[ 1 ] + this.props.initialSelection[ 3 ]
		};
	},

	renderHandles: function() {
		return _.range( 4 ).map( function( i ) {
			var ix = i % 2;
			var iy = Math.floor( i / 2 );

			return (
				<Handle
					x={ ix? this.state.x1: this.state.x0 }
					y={ iy? this.state.y1: this.state.y0 }
					onMouseDown={ this.startDragCorner( ix, iy )}
					key={ i }/>
			);
		}.bind( this ));
	},

	startDragCorner: function( ix, iy ) {
		return function( event ) {
			var horizontalParameter = ix? "x1": "x0";
			var verticalParameter = iy? "y1": "y0";

			this.setState({
				dragging: [ ix, iy ],
				origin: [
					this.state[ horizontalParameter ],
					this.state[ verticalParameter ]
				]
			});

			document.onmousemove = this.dragCorner;
		}.bind( this );
	},

	startPan: function() {
		return function( event ) {
			this.setState({
				panning: true
			});

			document.onmousemove = this.pan;
		}.bind( this );
	},

	endDragPan: function() {
		this.setState({
			dragging: null,
			panning: null
		});

		document.onmousemove = null;
	},

	dragCorner: function( event ) {
		var change = {};

		var ix = this.state.dragging[ 0 ];
		var iy = this.state.dragging[ 1 ];

		var bounds = this.refs.image.getDOMNode().getBoundingClientRect();
		var x = Math.floor( event.clientX - bounds.left );
		var y = Math.floor( event.clientY - bounds.top );

		x = Math.max( 0, Math.min( x, this.refs.image.getDOMNode().width ));
		y = Math.max( 0, Math.min( y, this.refs.image.getDOMNode().height ));

		var horizontalParameter, verticalParameter, oppositeHorizontalParameter, oppositeVerticalParameter;

		if( ix ) {
			horizontalParameter = "x1";
			oppositeHorizontalParameter = "x0";
		} else {
			horizontalParameter = "x0";
			oppositeHorizontalParameter = "x1";
		}

		if( iy ) {
			verticalParameter = "y1";
			oppositeVerticalParameter = "y0";
		} else {
			verticalParameter = "y0";
			oppositeVerticalParameter = "y1";
		}

		var dx = x - this.state[ oppositeHorizontalParameter ];
		var dy = y - this.state[ oppositeVerticalParameter ];

		// Actual distance from opposite corner
		var magnitude = Math.sqrt( Math.pow( dx, 2 ) + Math.pow( dy, 2 ));

		// Desired angle
		var theta = Math.atan2( iy? 1: -1, ( ix? 1: -1 ) * this.props.aspectRatio );

		// Aspect constrained measurements, relative to opposite corner
		var ax = Math.cos( theta ) * magnitude;
		var ay = Math.sin( theta ) * magnitude;

		change[ horizontalParameter ] = ax + this.state[ oppositeHorizontalParameter ];
		change[ verticalParameter ] = ay + this.state[ oppositeVerticalParameter ];

		var newCrop = _.merge( _.clone( this.state ), change );

		if( newCrop.x1 - newCrop.x0 <= this.props.minSize[ 0 ] ) {
			return;
		}

		if( newCrop.y1 - newCrop.y0 <= this.props.minSize[ 1 ] ) {
			return;
		}

		this.setState( change );
		this.props.updateSelection( this.state.x0, this.state.y0, this.state.x1, this.state.y1 );
	},

	pan: function( event ) {
		var width2 = this.getWidth() / 2;
		var height2 = this.getHeight() / 2;

		var bounds = this.refs.image.getDOMNode().getBoundingClientRect();
		var x = Math.floor( event.clientX - bounds.left );
		var y = Math.floor( event.clientY - bounds.top );

		var newRect = {
			x0: x - width2,
			y0: y - height2,
			x1: x + width2,
			y1: y + height2
		};

		if( newRect.x0 < 0 ) {
			newRect.x0 = 0;
		}

		if( newRect.x1 > bounds.width ) {
			newRect.x1 = bounds.width;
		}

		if( newRect.y0 < 0 ) {
			newRect.y0 = 0;
		}

		if( newRect.y1 > bounds.height ) {
			newRect.y1 = bounds.height;
		}

		if( newRect.x1 - newRect.x0 < this.props.minSize[ 0 ]) {
			delete newRect.x0;
			delete newRect.x1;
		}

		if( newRect.y1 - newRect.y0 < this.props.minSize[ 1 ]) {
			delete newRect.y0;
			delete newRect.y1;
		}

		this.setState( newRect );
	},

	getWidth: function() {
		return this.state.x1 - this.state.x0;
	},

	getHeight: function() {
		return this.state.y1 - this.state.y0;
	},

	getTopRect: function() {
		return {
			left: 0,
			top: 0,
			right: 0,
			height: this.state.y0
		};
	},

	getLeftRect: function() {
		return {
			left: 0,
			top: this.state.y0,
			width: this.state.x0,
			height: this.getHeight()
		};
	},

	getCenterRect: function() {
		return {
			left: this.state.x0,
			top: this.state.y0,
			width: this.getWidth(),
			height: this.getHeight()
		};
	},

	getRightRect: function() {
		return {
			left: this.state.x0 + this.getWidth(),
			top: this.state.y0,
			right: 0,
			height: this.getHeight()
		};
	},

	getBottomRect: function() {
		return {
			left: 0,
			top: this.state.y0 + this.getHeight(),
			right: 0,
			bottom: 4 // WTF?
		};
	},

	renderMask: function( rect ) {
		return (
			<Mask
				color={ this.props.maskColor }
				shape={ rect }
			/>
		);
	},

	renderWindow: function( rect ) {
		return (
			<Mask
				shape={ rect }
				onMouseDown={ this.startPan() }/>
		);
	}
});
