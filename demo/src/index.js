let React = require( "react" );
let SelectRect = require( "../.." );

// Require index.js from the root of the project. That is where our module"s interface is specified.
let ExampleComponent = require( "../.." ).ExampleComponent;

window.tracing = false;

let Demo = React.createClass({
	render() {
		return (
			<div id="demo">
				<h2>Selection Rectangle Demo</h2>
				{ this.state.tracing? <p>Coordinates are in the console.</p>: null }
				<SelectRect
					backgroundSrc={ "/images/selectrect.png" }
					size={[ 400, 200 ]}
					updateSelection={ this.trace }
				/>
			</div>
		);
	},

	getInitialState() {
		return {
			tracing: false
		};
	},

	trace( x0, y0, x1, y1 ) {
		console.log( x0, y0, x1, y1 );
	}
});

React.render( <Demo/>, document.body );
