function stack(data, config) {

    console.log(data)

    // import features from config
    var margin = config.margin,
        width = config.dimension.width,
        height = config.dimension.height,
        color = d3.scale.ordinal()
            .domain(data.categories)
            .range(config.colors);

    var nData = data.nData;

    nData.forEach(function(d) {
        var y0 = 0;
        d.nums = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}});
        d.total = d.nums[d.nums.length - 1].y1;
    });

    nData.sort(function(a, b) { return b.total - a.total; }); 

    // scales
    var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.1)
        .domain(nData.map(function(d) { return d.item; }));;

    var yScale = d3.scale.linear()
        .rangeRound([height, 0])
        .domain([0, d3.max(nData, function(d) { return d.total; })]);

    // axes
    var xAxis = d3.svg.axis()
       .scale(xScale)
       .orient("bottom");

    var yAxis = d3.svg.axis()
       .scale(yScale)
       .orient("left");

    // set up svg area
    var svg = d3.select("#" + config.targetArea).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    // the bars
    var item = svg.selectAll(".item")
        .data(nData)
        .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + xScale(d.item) + ", 0)"; });

    item.selectAll("rect")
        .data(function(d) { return d.nums; })
        .enter().append("rect")
            .attr("width", xScale.rangeBand())
            .attr("y", function(d) { return yScale(d.y1); })
            .attr("height", function(d) { return yScale(d.y0) - yScale(d.y1); })
            .style("fill", function(d) { return color(d.name)});

    // the axes
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    // legends
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
