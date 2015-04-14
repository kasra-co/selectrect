"use strict";

var React = require( "react" );
var _ = require( "lodash" );

var Mask = module.exports = React.createClass({
	displayName: "Mask",

	propTypes: {
		color: React.PropTypes.string,
		shape: React.PropTypes.object.isRequired
	},

	render: function() {
		var style = _.merge(
			this.props.shape,
			{
				position: "absolute",
				backgroundColor: this.props.color
			}
		);

		return (
			<div style={ style }/>
		);
	}
});
