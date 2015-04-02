var React = require( 'react' );

var ExampleComponent = module.exports = React.createClass({
	render: function() {
		return (
			<div>
				<h1>Edit styles for this module in style/_partial.scss</h1>
				<p>Rename your partial files and update the import statement in demo/src/index.scss</p>
				<p>{ this.props.message }</p>
				{ this.props.children }
			</div>
		);
	}
});
