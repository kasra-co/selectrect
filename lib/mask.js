let React = require( "react" );
let _ = require( "lodash" );

let Mask = module.exports = React.createClass({
	propTypes: {
		color: React.PropTypes.string.isRequired,
		shape: React.PropTypes.object.isRequired
	},

	render() {
		let style = _.merge(
			this.props.shape,
			{
				position: "absolute",
				backgroundColor: this.props.color,
				outline: "1px solid #f00"
			}
		);

		return (
			<div style={ style }/>
		);
	}
});
