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
				<button onClick={ this.toggle }>
					{ this.state.tracing? "stop ": "" }trace
				</button><br/>
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

	toggle() {
		this.setState({
			tracing: !this.state.tracing
		});
	},

	trace( x0, y0, x1, y1 ) {
		if( this.state.tracing ) {
			console.log( x0, y0, x1, y1 );
		}
	}
});

React.render( <Demo/>, document.body );
