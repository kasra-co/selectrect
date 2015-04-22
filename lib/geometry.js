var _ = require( "lodash" );

// Rect: ( x0, y0, x1, y1 )
// Bounds: (width, height )
exports.constrainRectToBounds = function( rect, bounds ) {
	var width = rect.x1 - rect.x0;
	var height = rect.y1 - rect.y0;
	var result = _.clone( rect );

	if( rect.x0 < 0 ) {
		result.x0 = 0;
		result.x1 = width;
	}

	if( rect.x1 > bounds.width ) {
		result.x0 = bounds.width - width;
		result.x1 = bounds.width;
	}

	if( rect.y0 < 0 ) {
		result.y0 = 0;
		result.y1 = height;
	}

	if( rect.y1 > bounds.height ) {
		result.y0 = bounds.height - height;
		result.y1 = bounds.height;
	}

	return result;
};