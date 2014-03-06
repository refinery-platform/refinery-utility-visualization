function layer(data, config) {

    var margin = config.margin;
    var width = config.dimension.width;
    var height = config.dimension.height;
    var padding = 10;
    var barPadding = 1;
    var color = d3.scale.ordinal()
        .range(config.colors);

    // set up svg area
    var svg = d3.select("#" + config.targetArea).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    var mainAxisLabels = d3.keys(data[0]).filter(function(key) { return key !== "set"; });

    data.forEach(function(d) {
        d.dataset = mainAxisLabels.map(function(name) { return {name: name, value: +d[name]}; });
    })

    // set up the necessary data structures
    var categoryData = new Array();
    for (var i = 0; i < mainAxisLabels.length; i++) {
        categoryData.push({ name: mainAxisLabels[i] });
    }

    for (var i = 0; i < mainAxisLabels.length; i++) {
            categoryData[i].setData = []; 
            for (var j = 0; j < data.length; j++) {
                categoryData[i].setData.push({name: data[j].set, value: data[j][categoryData[i].name] });
            }
    }

    color.domain(mainAxisLabels);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d3.max(d.dataset, function(d) { return d.value; })})])
        .range([0, height]);

    var subChartWidth = (width + margin.left + margin.right) / categoryData.length - 10;
    var subSvg = [];
    for (var i = 0; i < categoryData.length; i++) {
        subSvg[i] = svg.append("g")
                        .attr("y", 0)
                        .attr("width", (subChartWidth) + "px")
                        .attr("height", (height) + "px")
                        .append("g");
    }

    // make the y-axis
    var yAxis = d3.svg.axis()
                    .scale(d3.scale.linear().domain(yScale.domain().reverse()).range(yScale.range()))
                    .orient("left");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // make the big x axis

    // start plotting the stuff in their unique svg containers
    for (var ii = 0; ii < categoryData.length; ii++) {
        var g = subSvg[ii].selectAll("rect")
            .data(categoryData[ii].setData)
            .enter().append("rect")
                .attr("x", function(d, i) { return i * ((subChartWidth - padding) / categoryData.length) + padding + (ii * subChartWidth); })  
                .attr("y", function(d) { return height - yScale(+d.value); })
                .attr("width", (subChartWidth - padding) / categoryData.length - barPadding)
                .attr("height", function(d) { return yScale(+d.value); })
                .attr("fill", color(categoryData[ii].name)); // subject to change

        // TODO: set up some x-axis stuff
        var xScale = d3.scale.ordinal()
                        .rangeRoundBands([0, subChartWidth], 0.1)
                        .domain(data.map(function(d) { return d.set; }));

        var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom");

        subSvg[ii].append("g")
            .attr("class", "layerXAxis")
            .attr("transform", "translate(" + (ii * subChartWidth) + ", " + (height) + ")")
            .call(xAxis);

        subSvg[ii].style("path.fill", "red");

        console.log("x axis translation: " + (ii * subChartWidth))
    }
    
}
