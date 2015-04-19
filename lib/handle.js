"use strict";

var React = require( "react" );

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

	render: function() {
		return (
			<div
				onMouseDown={ this.props.onMouseDown }
				className="handle"
				style={{
					position: "absolute",
					left: this.props.x - 10,
					top: this.props.y - 10,
					width: 20,
					height: 20,
					backgroundColor: "rgba( 255, 255, 255, 0.5 )",
					outline: "1px solid rgba( 0, 0, 0, 0.5 )"
				}}
			/>
		);
	}
});
