let React = require( "react" );
let Mask = require( "./mask" );

let SelectRect = module.exports = React.createClass({
	propTypes: {
		maskColor: React.PropTypes.string,
		initialSelection: React.PropTypes.array
	},

	render() {
		return (
			<div style={{
				position: "relative",
				display: "inline-block"
			}}>
				<img src={ this.props.backgroundSrc }/>
				{ this.renderMask( this.getTopRect() )}
				{ this.renderMask( this.getLeftRect() )}
				{ this.renderMask( this.getRightRect() )}
				{ this.renderMask( this.getBottomRect() )}
			</div>
		);
	},

	getDefaultProps() {
		return {
			initialSelection: [ 0, 0, "100%", "100%" ],
			maskColor: "rgba( 0, 0, 0, 0.25 )"
		};
	},

	getInitialState() {
		return {
			x: this.props.initialSelection[ 0 ],
			y: this.props.initialSelection[ 1 ],
			width: this.props.initialSelection[ 2],
			height: this.props.initialSelection[ 3 ]
		};
	},

	getTopRect() {
		return {
			left: 0,
			top: 0,
			right: 0,
			height: this.state.y
		};
	},

	getLeftRect() {
		return {
			left: 0,
			top: this.state.y,
			width: this.state.x,
			height: this.state.height
		};
	},

	getRightRect() {
		return {
			left: this.state.x + this.state.width,
			top: this.state.y,
			right: 0,
			height: this.state.height
		};
	},

	getBottomRect() {
		return {
			left: 0,
			top: this.state.y + this.state.height,
			right: 0,
			bottom: 0
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
