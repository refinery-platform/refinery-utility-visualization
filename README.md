Refinery Utility Visualization
==============================
The Refinery Utility Visualization software library is a JavaScript library that utilizes D3 and jQuery to display a variety of graphs given a set of data and configurations. The library is able to display four different types of charts: regular, stacked, layered, and grouped bar charts.


Use
===
To use the library, you can simply do a call such as:

'''rfnry.vis.util.draw("stack", data, config)'''

The example above would draw a stack bar chart of the data provided in an area indicated in the config object.

1. The draw function's first argument is a the type of chart to be drawn. The possible options are "simple", "group", "layer", and "stack".

2. The second argument takes a data object, more specifically a matrix of the data set. 



File Structure
=================
There is generally no need to 

The src/js/charts directory contains three different "generic" functions.

genericPlain() : Creates a simple (regular) bar charts given an SVG group draw space, a data set, a global maximum of the data set, and other configurations. 
