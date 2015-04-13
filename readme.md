# SelectRect

A rectangular selection widget.

## Usage

```
<SelectRect
	backgroundSrc={ "/images/some.jpg" }
	initialSelection={[ 0, 0, 600, 200 ]}
	scale={ 1 / 3 }
	updateSelection={
		function( x, y, width, height ) {
			console.log( x, y, width, height );
		}
	}
/>

```

`backgroundSrc`: URL of the background image. May be a base64 data url.

`initialSelection`: (optional) The initial

`scale`: The background image will be scaled by this factor. The coordinates passed to `updateSelection` will be compensated for this scaling, so that they can be used as is for a crop operation.

`updateSelection`: Called when the rectangular selection changes.
