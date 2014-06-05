Refinery Utility Visualization
==============================
The Refinery Utility Visualization software library is a JavaScript library that utilizes D3 and jQuery to display a variety of graphs given a set of data and configurations. The library is able to display four different types of charts: regular, stacked, layered, and grouped bar charts.

Building
========
Install the frontend bower components such as d3 and jQuery
```bower install```

Install the backend components like grunt and its plugins
```npm install```

Run grunt on Gruntfile.js
```grunt```

If you want to generate docs in the doc/ folder, run
```grunt doc```

Of course there is already a minified version in the root directory of this library so why bother unless you're tweaking it.

Use
===
To use the library, you can simply do a call such as:

```rfnry.vis.util.draw("stack", data, config)```

The example above would draw a stack bar chart of the data provided in an area indicated in the config object.

1. The draw function's first argument is a the type of chart to be drawn. The possible options are ```simple```, ```group```, ```layer```, and ```stack```.

2. The second argument takes a data object, more specifically a matrix of the data set. The example supplied in the example folder looks something like the following:

      ```
      data = {
            items: ["apple", "bear", "cat", "dinosaur", "elephant", "fish"],
            categories: ["agility", "buffness", "conspicuousness", 
                         "dangerousness", "elasticity", "frugality"],
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
  
3. The third and last argument is the configuration object for this chart. The configuration object would contain something like the following:

      ```
      var config = {
            height: 800,
            width: 1000,
            drawTarget: nameOfSomeDiv,
            orientation: vertical
      }
      ```
      
      The orientation can also be horizontal - which is actually the default if a bad orientation value is provided, because it's easier to lie flat than stand up. The ```drawTarget``` may be a bit confusing, but hopefully the example html file will provide clarity.


File Structure
=================
There is generally no need to know much about the file structure unless you plan on hacking this up a bit.

src/js/

The ```pre.js``` includes a useful tooltip thing as well as loads events for the tooltip.

The ```draw.js``` file contains an "adapter" function that invokes one of the four charting function depending on its arguments. It is preferable that you use this instead of manually calling one of the chart functions to make your life easier. It also performs deep copies so objects don't get messed up.

---

src/js/charts/

```genericplain.js``` Creates a simple (regular) bar charts given an SVG group draw space, a data set, a global maximum of the data set, and other configurations. 

```genericsvg.js``` Partitions a target draw area (invoked manually by the user or by one of the chart functions) into nine different pieces (3 by 3). Whether or not this is conventional was not considered, but helpful it was in enabling code reusability for the library at the time given the author's questionable imagination.

```genericaxis.js``` Draw an SVG axis given some configurations. You don't have to worry about this unless you really want to configure it. Default is ~5 ticks, and the default tick size is apparently 6. Some other things like the shifts involve which direction the axis would shift to, which is used in cases when the axis would need to be shifted to appear fully on screen. A blank axis is an axis that lacks the stroke.

```simpleplain.js``` Create a simple plain bar chart - nothing really fancy.

```group.js``` Create a grouped bar chart.

```layer.js``` Create a layered bar chart.

```stack.js``` Create a stacked bar chart.



Good luck
