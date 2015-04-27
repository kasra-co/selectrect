var _ = require( "lodash" );

// Rect: ( x0, y0, x1, y1 )
// Bounds: (width, height )
exports.constrainTranslation = function( rect, bounds ) {
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

exports.constrainScale = function( rect, bounds ) {
	var overageRatio = Math.min(
		1,
		( bounds[0] - rect[0][0] ) / ( rect[1][0] - rect[0][0] ),
		( bounds[1] - rect[0][1] ) / ( rect[1][1] - rect[0][1] )
	);

	var newRect = [
		rect[0],
		[
			( rect[1][0] - rect[0][0] ) * overageRatio + rect[0][0],
			( rect[1][1] - rect[0][1] ) * overageRatio + rect[0][1]
		]
	];

	return newRect;
};

exports.dragScale = function( anchor, handle, mouse, aspect, points ) {
	return points.map( function( p ) {
		return [
			( handle[0] - anchor[0] ) / dist( handle, anchor ) * dist( mouse, anchor ) + anchor[0],
			( handle[1] - anchor[1] ) / dist( handle, anchor ) * dist( mouse, anchor ) + anchor[1]
		];
	});
};
