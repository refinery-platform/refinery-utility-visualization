function plain(data, config) {
    
    var margin = config.margin;
    var width = config.dimension.width;
    var height = config.dimension.height;
    var color = d3.scale.ordinal()
        .range(config.colors);

    // set up svg area
    var svg = d3.select("#" + config.targetArea).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    var padding = 30;
    var barPadding = 1;

    data.forEach(function(d) {
        d.total = (+d.d1) + (+d.d2) + (+d.d3) + (+d.d4) + (+d.d5);
    });

    color.domain(data.map(function(d) { return d.set; }));


    // scales
    var scale = d3.scale.linear()
        .range([0, height - 20])
        .domain([0, d3.max(data, function(d) { return d.total; })]);

    // draw the rectangles
    svg.selectAll("rect")
        .data(data)
        .enter().append("rect")
            .attr("x", function(d, i) { return i * ((width - padding) / data.length) + padding; })
            .attr("y", function(d) { return height - scale(d.total); })
            .attr("width", (width - padding) / data.length - barPadding)
            .attr("height", function(d) { return scale(d.total); })
            .attr("fill", function(d) { return color(d.set); });

    svg.selectAll("text")
        .data(data)
        .enter().append("text")
        .text(function(d) { return d.total; })
            .attr("text-anchor", "middle")
            .attr("x", function(d, i) { return i * ((width - padding) / data.length) + (width / data.length - barPadding) / 2 + padding; })
            .attr("y", function(d) { return height - scale(d.total) + 14; })
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "white");

    var axisScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.total; })])
        .range([height - 20, 0]);

    var yAxis = d3.svg.axis()
        .scale(axisScale)
        .orient("left");

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ", 20)")
        .call(yAxis);

    // add the legends        
    var legend = svg.selectAll(".legend")
        .data(data.map(function(d) { return d.set; }))
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
