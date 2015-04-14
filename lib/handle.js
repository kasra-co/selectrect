"use strict";

let React = require( "react" );

var Handle = module.exports = React.createClass({
	displayName: "Handle",

	propTypes: {
		x: React.PropTypes.oneOfType([
			React.PropTypes.number,
			React.PropTypes.string
		]).isRequired,
		y: React.PropTypes.oneOfType([
			React.PropTypes.number,
			React.PropTypes.string
		]).isRequired,
		onMouseDown: React.PropTypes.func.isRequired
	},

	render() {
		return (
			<div
				onMouseDown={ this.props.onMouseDown }
				style={{
					position: "absolute",
					left: this.props.x - 5,
					top: this.props.y - 5,
					width: 10,
					height: 10,
					backgroundColor: "rgba( 255, 255, 255, 0.5 )",
					outline: "1px solid rgba( 0, 0, 0, 0.5 )"
				}}
			/>
		);
	}
});
