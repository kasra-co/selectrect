var expect = require( "chai" ).expect;
var geometry = require( "../lib/geometry" );

describe( "Geometry", function() {
	describe( "constrainScale", function() {
		var table = [
			[[[0, 0], [8, 6]], [4, 4], [[0, 0], [4, 3]]],
			[[[0, 1], [8, 7]], [4, 5], [[0, 1], [4, 4]]],
			[[[1, 0], [9, 6]], [5, 4], [[1, 0], [5, 3]]],
			[[[1, 1], [9, 7]], [5, 5], [[1, 1], [5, 4]]]
		];

		table.forEach( function( test ) {
			it(
				"should resize " + test[0] +
					" to " + test[2] +
					" to fit " + test[1],
				function() {
					expect( geometry.constrainScale( test[0], test[1] ))
					.to.deep.equal( test[2] );
				}
			);
		});
	});

	describe( "constrainTranslation", function() {
		var table = [
			[[[-1, -1], [1, 1]], {width: 2, height: 2}, [[0, 0], [2, 2]]],
			[[[-1, 0], [1, 2]], {width: 2, height: 2}, [[0, 0], [2, 2]]],
			[[[0, -1], [2, 1]], {width: 2, height: 2}, [[0, 0], [2, 2]]],
			[[[0, 0], [2, 2]], {width: 2, height: 2}, [[0, 0], [2, 2]]],
			[[[0, 1], [2, 3]], {width: 2, height: 2}, [[0, 0], [2, 2]]],
			[[[1, 0], [3, 2]], {width: 2, height: 2}, [[0, 0], [2, 2]]],
			[[[1, 1], [3, 3]], {width: 2, height: 2}, [[0, 0], [2, 2]]]
		];

		table.forEach( function( test ) {
			it(
				"should tranlate " + test[0] +
					" to " + test[2] +
					" to fit " + test[1],
				function() {
					expect( geometry.constrainTranslation( test[0], test[1] ))
					.to.deep.equal( test[2] );
				}
			);
		});
	});
});
