function plain(data, config) {

    // import features from config
    var margin = config.margin,
        width = config.dimension.width,
        height = config.dimension.height,
        padding = 30,
        barPadding = 1,
        barThickness = (width - padding) / data.items.length,
        color = d3.scale.ordinal()
            .range(config.colors)
            .domain(data.items.map(function(d) { return d; }));

    // get the sum of each item sets' categories
    data.total = [];
    for (var i = 0; i < data.items.length; i++) {
        data.total[i] = data.matrix[i].sum();
    }

    // set up svg area
    var svg = d3.select("#" + config.targetArea).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    // scales
    var yScale = d3.scale.linear()
        .range([0, height - 20])
        .domain([0, d3.max(data.total, function(d) { return d; })]);

    var yAxisScale = d3.scale.linear()
    	.domain([0, data.total.max()])
    	.range([height - 20, 0]);


    // draw the rectangles
    svg.selectAll("rect")
        .data(data.total)
        .enter().append("rect")
            .attr("x", function(d, i) { return i * (barThickness) + padding; })
            .attr("y", function(d) { return height - yScale(d); })
            .attr("width", barThickness)
            .attr("height", function(d) { return yScale(d); })
            .attr("fill", function(d, i) { return color(data.items[i]); });

    svg.selectAll("text")
        .data(data)
        .enter().append("text")
        .text(function(d) { return d.total; })
            .attr("text-anchor", "middle")
            .attr("x", function(d, i) { return i * ((width - padding) / data.length) + (width / data.length - barPadding) / 2 + padding; })
            .attr("y", function(d) { return height - yScale(d.total) + 14; })
            .attr("font-size", "11px")
            .attr("fill", "white");

    var yAxis = d3.svg.axis()
        .scale(yAxisScale)
        .orient("left");

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ", 20)")
        .call(yAxis);


    // add the legends        
    var legend = svg.selectAll(".legend")
        .data(data.items)
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0, " + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", "0.35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
        
}
