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
				onMouseUp={ this.endDrag }
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
					onMouseDown={ this.startDrag( ix, iy )}
					key={ i }/>
			);
		}.bind( this ));
	},

	startDrag: function( ix, iy ) {
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

			document.onmousemove = this.drag;
		}.bind( this );
	},

	endDrag: function() {
		this.setState({
			dragging: null
		});

		document.onmousemove = null;
	},

	drag: function( event ) {
		var change = {};

		var ix = this.state.dragging[ 0 ];
		var iy = this.state.dragging[ 0 ];

		var bounds = this.refs.image.getDOMNode().getBoundingClientRect();
		var x = Math.floor( event.clientX - bounds.left );
		var y = Math.floor( event.clientY - bounds.top );

		x = Math.max( 0, Math.min( x, this.refs.image.getDOMNode().width ));
		y = Math.max( 0, Math.min( y, this.refs.image.getDOMNode().height ));


		var horizontalParameter = ix? "x1": "x0";
		var verticalParameter = iy? "y1": "y0";
		var oppositeHorizontalParameter = !ix? "x1": "x0";
		var oppositeVerticalParameter = !iy? "y1": "y0";

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
			<Mask shape={ rect } />
		);
	}
});
