let React = require( "react" );
let SelectRect = require( "../.." );

// Require index.js from the root of the project. That is where our module"s interface is specified.
let ExampleComponent = require( "../.." ).ExampleComponent;

let demo = (
	<SelectRect
		backgroundSrc={ "/images/selectrect.png" }
		initialSelection={[ 200, 100, 400, 200 ]}
		scale={ 1 / 3 }
		aspectRatio={ 2 / 1 }
		updateSelection={ console.log }
	/>
);

React.render( demo, document.body );
