var _ = require( "lodash" );

exports.constrainTranslation = function( rect, bounds ) {
	var width = rect[1][0] - rect[0][0];
	var height = rect[1][1] - rect[0][1];
	var result = _.clone( rect );

	if( rect[0][0] < 0 ) {
		result[0][0] = 0;
		result[1][0] = width;
	}

	if( rect[1][0] > bounds.width ) {
		result[0][0] = bounds.width - width;
		result[1][0] = bounds.width;
	}

	if( rect[0][1] < 0 ) {
		result[0][1] = 0;
		result[1][1] = height;
	}

	if( rect[1][1] > bounds.height ) {
		result[0][1] = bounds.height - height;
		result[1][1] = bounds.height;
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

exports.scaleByPoints = function( rect, size, anchor, handle, mouse ) {
	var d = Math.sqrt( Math.pow( size[0], 2 ) + Math.pow( size[1], 2 ));
	var d1 = Math.sqrt( Math.pow( mouse[0], 2 ) + Math.pow( mouse[1], 2 ));
	var sign = [
		(anchor[0] - handle[0]) / Math.abs(anchor[0] - handle[0]),
		(anchor[1] - handle[1]) / Math.abs(anchor[1] - handle[1])
	];

	var newHandle = [
		( size[0] * sign[0] / d ) * d1 + anchor[0],
		( size[1] * sign[1] / d ) * d1 + anchor[1],
	];

	return [[
		Math.min( anchor[0], newHandle[0] ),
		Math.min( anchor[1], newHandle[1] )
	], [
		Math.max( anchor[0], newHandle[0] ),
		Math.max( anchor[1], newHandle[1] )
	]];
};
