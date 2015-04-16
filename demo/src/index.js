let React = require( "react" );
let SelectRect = require( "../.." );

// Require index.js from the root of the project. That is where our module"s interface is specified.
let ExampleComponent = require( "../.." ).ExampleComponent;

let demo = (
	<div>
		<h2>Selection Rectangle Demo</h2>
		<p>Coordinates are in the console.</p>
		<SelectRect
			backgroundSrc={ "/images/selectrect.png" }
			initialSelection={[ 200, 100, 400, 200 ]}
			scale={ 1 / 3 }
			minSize={[ 400, 200 ]}
			aspectRatio={ 2 / 1 }
			updateSelection={
				function( x0, y0, x1, y1 ) {
					//console.log( x0, y0, x1, y1 );
				}
			}
		/>
	</div>
);

React.render( demo, document.body );
