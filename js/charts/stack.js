function stack(data, config) {

    console.log(data)

    // import features from config
    var margin = config.margin,
        width = config.dimension.width,
        height = config.dimension.height,
        hoverOpacity = config.hoverOpacity,
        color = d3.scale.ordinal()
            .domain(data.categories)
            .range(config.colors);

    var nData = data.nData;

    if (config.orientation == "vertical") {
        nData.forEach(function(d) {
            var y0 = 0;
            d.nums = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name] }});
            d.total = d.nums[d.nums.length - 1].y1;
        });
    } else if (config.orientation == "horizontal") {
        nData.forEach(function(d) {
            var x0 = 0;
            d.nums = color.domain().map(function(name) { return {name: name, x0: x0, x1: x0 += d[name] }});
            d.total = d.nums[d.nums.length - 1].x1;
        })
    } else {
        console.error("Incorrect orientation");
    }

    nData.sort(function(a, b) { return b.total - a.total; }); 

    // scales
    var vXScale = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.1)
        .domain(nData.map(function(d) { return d.item; }));

    var vYScale = d3.scale.linear()
        .rangeRound([height, 0])
        .domain([0, d3.max(nData, function(d) { return d.total; })]);

    var hXScale = d3.scale.linear()
        .domain([0, d3.max(nData, function(d) { return d.total; })])
        .range([0, width - 200]);

    var hYScale = d3.scale.ordinal()
        .rangeRoundBands([0, height], 0.1)
        .domain(nData.map(function(d) { return d.item; }));

    // axes
    var vXAxis = d3.svg.axis()
       .scale(vXScale)
       .orient("bottom");

    var vYAxis = d3.svg.axis()
       .scale(vYScale)
       .orient("left");

    var hXAxis = d3.svg.axis()
        .scale(hXScale)
        .orient("bottom");

    var hYAxis = d3.svg.axis()
        .scale(hYScale)
        .orient("left");

    // set up svg area
    var svg = d3.select("#" + config.targetArea).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    // the bars
    if (config.orientation == "vertical") {
        var items = svg.selectAll(".item")
            .data(nData)
            .enter().append("g")
                .attr("class", "g")
                .attr("transform", function(d) { return "translate(" + vXScale(d.item) + ", 0)"; });

        items.selectAll("rect")
            .data(function(d) { return d.nums; })
            .enter().append("rect")
                .attr("class", "bar")
                .attr("y", function(d) { return vYScale(d.y1); })
                .attr("width", vXScale.rangeBand())
                .attr("height", function(d) { return vYScale(d.y0) - vYScale(d.y1); })
                .style("fill", function(d) { return color(d.name)})
                .on("mouseover", function() {
                    var gElem = this.parentNode;
                    d3.select(gElem).selectAll(".bar").attr("opacity", hoverOpacity);
                    d3.select(this).attr("opacity", 1);
                })
                .on("mouseout", function() {
                    var gElem = this.parentNode;
                    d3.select(gElem).selectAll(".bar").attr("opacity", 1);
                });
    } else if (config.orientation == "horizontal") {
        var items = svg.selectAll(".item")
            .data(nData)
            .enter().append("g")
                .attr("class", "g")
                .attr("transform", function(d) {return "translate(0, " + hYScale(d.item) + ")"});

        items.selectAll("rect")
            .data(function(d) { return d.nums.reverse(); })
            .enter().append("rect")
                .attr("class", "bar")
                .attr("y", function(d) { return hYScale(d.name); })
                .attr("width", function(d) { return hXScale(d.x1); })
                .attr("height", hYScale.rangeBand())
                .style("fill", function(d) { return color(d.name); })
                .on("mouseover", function() {
                    var gElem = this.parentNode;
                    d3.select(gElem).selectAll(".bar").attr("opacity", hoverOpacity);
                    d3.select(this).attr("opacity", 1);
                })
                .on("mouseout", function() {
                    var gElem = this.parentNode;
                    d3.select(gElem).selectAll(".bar").attr("opacity", 1);
                });
    } else {
        console.error("Incorrect orientation");
    }

    // the axes
    if (config.orientation == "vertical") {
        svg.append("g")
            .attr("class", "stackVXAxis")
            .attr("transform", "translate(0, " + height + ")")
            .call(vXAxis);

        svg.append("g")
            .attr("class", "stackVYAxis")
            .call(vYAxis)
    } else if (config.orientation == "horizontal") {
        svg.append("g")
            .attr("class", "stackHXAxis")
            .attr("transform", "translate(0, " + height + ")")
            .call(hXAxis);

        svg.append("g")
            .attr("class", "stackHYAxis")
            .call(hYAxis);
    }

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
