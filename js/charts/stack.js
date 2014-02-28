function stack(data, config) {

    var margin = config.margin;
    var width = config.dimension.width;
    var height = config.dimension.height;
    var color = d3.scale.ordinal()
        .range(config.colors);

    // set up svg area
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.1);

    var y = d3.scale.linear()
        .rangeRound([height, 0]);

    var xAxis = d3.svg.axis()
       .scale(x)
       .orient("bottom");

    var yAxis = d3.svg.axis()
       .scale(y)
       .orient("left");

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "set"; }));

    data.forEach(function(d) {
        var y0 = 0;
        d.nums = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}});
        d.total = d.nums[d.nums.length - 1].y1;
    });

    data.sort(function(a, b) { return b.total - a.total; }); 

    x.domain(data.map(function(d) { return d.set; }));
    y.domain([0, d3.max(data, function(d) { return d.total; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    var set = svg.selectAll(".set")
        .data(data)
        .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + x(d.set) + ", 0)"; });

    set.selectAll("rect")
        .data(function(d) { return d.nums; })
        .enter().append("rect")
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.y1); })
            .attr("height", function(d) { return y(d.y0) - y(d.y1); })
            .style("fill", function(d) { return color(d.name)});

    var legend = svg.selectAll(".legend")
        .data(color.domain().slice().reverse())
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
