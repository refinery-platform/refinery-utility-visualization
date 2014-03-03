function pie(data, config) {

    var margin = config.margin;
    var width = config.dimension.width;
    var height = config.dimension.height;
    var color = d3.scale.ordinal()
        .range(config.colors);

    var radius = Math.min(width, height) / 2;

    // set up svg area
    var svg = d3.select("#" + config.targetArea).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")");

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0)

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.total; });

    var dataElements = d3.keys(data[0]).filter(function(key) { return key !== "set"; });
    data.forEach(function(d) {
        d.total = 0;
        for (var i = 0; i < dataElements.length; i++) {
            d.total += +d[dataElements[i]];
        }
    });

    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.total); });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", "0.35em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.data.total; });

    var legend = svg.selectAll(".legend")
    .data(color.domain().slice().reverse())
    .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0, " + i * 20 + ")"; });

    // add a legend
    legend.append("rect")
        .attr("x", radius + 24)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    // add text to the legend
    
    legend.append("text")
        .attr("x", radius + 54)
        .attr("y", 9)
        .attr("dy", "0.35em")
        .style("text-anchor", "end")
        .text(function(d, i) { return data[i].set; });    
}

