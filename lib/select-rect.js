let React = require( "react" );
let _ = require( "lodash" );
let Mask = require( "./mask" );
let Handle = require( "./handle" );

let SelectRect = module.exports = React.createClass({
	displayName: "SelectRect",

	propTypes: {
		maskColor: React.PropTypes.string,
		initialSelection: React.PropTypes.arrayOf( React.PropTypes.oneOfType([
			React.PropTypes.number,
			React.PropTypes.string
		])),
		updateSelection: React.PropTypes.func.isRequired
	},

	render() {
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
				{ this.renderMask( this.getRightRect() )}
				{ this.renderMask( this.getBottomRect() )}
				{ this.renderHandles() }
			</div>
		); // TODO: center pan & crosshair
	},

	getDefaultProps() {
		return {
			initialSelection: [ 0, 0, "100%", "100%" ],
			maskColor: "rgba( 0, 0, 0, 0.25 )"
		};
	},

	getInitialState() {
		return {
			x0: this.props.initialSelection[ 0 ],
			y0: this.props.initialSelection[ 1 ],
			x1: this.props.initialSelection[ 0 ] + this.props.initialSelection[ 2 ],
			y1: this.props.initialSelection[ 1 ] + this.props.initialSelection[ 3 ]
		};
	},

	renderHandles() {
		return _.range( 4 ).map( function( i ) {
			let ix = i % 2;
			let iy = Math.floor( i / 2 );

			return (
				<Handle
					x={ ix? this.state.x1: this.state.x0 }
					y={ iy? this.state.y1: this.state.y0 }
					onMouseDown={ this.startDrag( ix, iy )}
					key={ i }/>
			);
		}.bind( this ));
	},

	startDrag( ix, iy ) {
		return function( event ) {
			this.setState({
				dragging: [ ix, iy ]
			});

			document.onmousemove = this.drag;
		}.bind( this );
	},

	endDrag() {
		this.setState({
			dragging: null
		});

		document.onmousemove = null;
	},

	drag( event ) {
		let change = {};

		let [ ix, iy ] = this.state.dragging;

		let x = Math.max( 0, Math.min( event.clientX, this.refs.image.getDOMNode().width ));
		let y = Math.max( 0, Math.min( event.clientY, this.refs.image.getDOMNode().height ));

		change.dragging = [ ix, iy ] = this.coordinateInversion( x, y, ix, iy );

		let horizontalParameter = ix? "x1": "x0";
		let verticalParameter = iy? "y1": "y0";

		change[ horizontalParameter ] = x;
		change[ verticalParameter ] = y;

		this.setState( change );
		this.props.updateSelection( this.state.x0, this.state.y0, this.state.x1, this.state.y1 );
	},

	coordinateInversion( x, y, ix, iy ) {
		if( x > this.state.x1 && ix === 0 ) {
			ix = 1;
		} else if( x < this.state.x0 && ix === 1 ) {
			ix = 0;
		}

		if( y > this.state.y1 && iy === 0 ) {
			iy = 1;
		} else if( y < this.state.y0 && iy === 1 ) {
			iy = 0;
		}

		return [ ix, iy ];
	},

	getWidth() {
		return this.state.x1 - this.state.x0;
	},

	getHeight() {
		return this.state.y1 - this.state.y0;
	},

	getTopRect() {
		return {
			left: 0,
			top: 0,
			right: 0,
			height: this.state.y0
		};
	},

	getLeftRect() {
		return {
			left: 0,
			top: this.state.y0,
			width: this.state.x0,
			height: this.getHeight()
		};
	},

	getRightRect() {
		return {
			left: this.state.x0 + this.getWidth(),
			top: this.state.y0,
			right: 0,
			height: this.getHeight()
		};
	},

	getBottomRect() {
		return {
			left: 0,
			top: this.state.y0 + this.getHeight(),
			right: 0,
			bottom: 4 // WTF?
		};
	},

	renderMask( rect ) {
		return (
			<Mask
				color={ this.props.maskColor }
				shape={ rect }
			/>
		);
	}
});
