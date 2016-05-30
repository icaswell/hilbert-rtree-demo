# Hilbert Packed R-Tree written in JavaScript (Typescript)

This is an implementation of a Hilbert Packed  R-Tree. R-Trees are a special data structure for indexing spatial data. To improve the performance of query operations on the data structure, the R-Tree has been packed using the  space filling [Hilbert Curve](https://en.wikipedia.org/wiki/Hilbert_curve).

* The majority of the logic of the Hilbert tree was written by jorgenkg.  I (icaswell) modified the orderings to include other space filling curves (Z-order etc.), made the visualization prettier, added options to improve the artificial data (using momentum and tunneling probabilities as described in the associated paper), added random seeding, added a function to visualize curves, and most importantly added functionality to compare the empirical performance between different spce-filling curves.

## Demo

Open index.html to see a comparison between the Hilbert R-Tree and an R-Tree with different leaf-node orderings, including the space-filling Z-order curve as well as row-major and random ordering.

## Tutorial

##### Create an initially empty R-Tree

``` javascript
var maxNodes = 4;   // Maximum number of nodes within a bounding rectangle
var tree     = new RTree( maxNodes );
```

##### Create some structured data

``` javascript
var structuredData = [
  // {x coordinate, y coordinate, width, height, the data to store at this location}
  {x: 0,  y: 0,  width: 10, height: 10, data: "This can be anything"},
  {x: 10, y: 20, width: 15, height: 20, data: 123456                },
  {x: 20, y: 20, width: 20, height: 25, data: {even: "this"}        },
]
```

##### Update the tree

At this point we can either choose to insert the data in batch mode or insert the data rows iteratively. The batch insert will produce the most efficient trees in the general case.

The batch procedure:

``` javascript
// Batch insert the data
tree.batchInsert( structuredData );
```

The iterative alternative:

``` javascript
// Insert the nodes one at the time
for (var i = structuredData.length - 1; i >= 0; i--) {
  tree.insert( structuredData[i] );
}
```

##### Search

The spatial R-Tree index is queried by using a bounding rectangle. The search will return data entries that overlap with query rectangle. 

``` javascript
// Search the R-Trees by using a bounding rectangle
var boundingRectangle = { x: 0,  y: 0, width: 5, height: 5 };
var results           = tree.search( boundingRectangle ); // results will contain the first element of structuredData
console.log( results ); // prints: [ "This can be anything" ]
```

## Requirements

*  [lodash](https://lodash.com)

## Setting up the dev environment

1. Install NodeJS and NPM
2. Run `npm install` from the project directory
3. Run `npm start` to initialize the automatic TypeScript compiling and browser refreshing

## Kudos
*  The TypeScript definitions published by [DefinitelyTyped](http://definitelytyped.org) has been essential.
*  The project includes a fast implementation of a deep flattening function written by @willsp

#### Other

The demo uses the [Knockstrap library](http://faulknercs.github.io/Knockstrap/) written by @faulknercs, as well as jQuery, KnockoutJS and Bootstrap.