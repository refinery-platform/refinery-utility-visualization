Refinery Utility Visualization
==============================
The Refinery Utility Visualization software library is a JavaScript library that utilizes D3 and jQuery to display a variety of graphs given a set of data and configurations. The library is able to display four different types of charts: regular, stacked, layered, and grouped bar charts.


Use
===
To use the library, you can simply do a call such as:

```rfnry.vis.util.draw("stack", data, config)```

The example above would draw a stack bar chart of the data provided in an area indicated in the config object.

1. The draw function's first argument is a the type of chart to be drawn. The possible options are ```simple```, ```group```, ```layer```, and ```stack```.

2. The second argument takes a data object, more specifically a matrix of the data set. The example supplied in the sample folder looks something like the following:

      ```
      data = {
            items: ["apple", "bear", "cat", "dinosaur", "elephant", "fish"],
            categories: ["agility", "buffness", "conspicuousness", "dangerousness", "elasticity", "frugality"],
            matrix: [
                [6, 29, 18, 30, 7, 2],
                [8, 27, 17, 12, 12, 4],
                [12, 21, 16, 3, 19, 6],
                [20, 18, 16, 9, 7, 8],
                [22, 5, 15, 20, 1, 10],
                [3, 6, 9, 12, 15, 18]
            ]
        }
       ```
  Imagine the matrix presented above to be a table. The items are listed in descending order on the left side, while the categories are listed in order from left to right on the top side. Each item contains a series of categories that are the same. Items lacking a particular category can often have that spot filled with 0.
  
  In the example above, a cat's buffness would be a value of 21.

File Structure
=================
There is generally no need to 

The src/js/charts directory contains three different "generic" functions.

genericPlain() : Creates a simple (regular) bar charts given an SVG group draw space, a data set, a global maximum of the data set, and other configurations. 
