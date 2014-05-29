function genericPlain(data, config, events) {

    var width = config.width, height = config.height, globalMax = config.globalMax,
        isVert = (config.orientation === "vertical")? true : false;
    var barPadding = (isVert)? 0.01 * width : 0.01 * height;
    var barThickness = height / data.length - barPadding;
    var xScale = d3.scale.linear()
        .domain([0, globalMax])
        .range([0, width]);
    var yScale = d3.scale.ordinal()
        .domain(data.map(function(d) { return d.id; }))
        .rangeRoundBands([0, height], 0);

    if (isVert) {
        barThickness = width / data.length - barPadding;
        xScale = d3.scale.ordinal()
            .domain(data.map(function(d) { return d.id; }))
            .rangeRoundBands([0, width], 0);
        yScale = d3.scale.linear()
            .domain([0, globalMax]) 
            .range([height, 0]);
    }

    d3.select(config.drawTarget).selectAll("rect")
        .data(data).enter().append("rect").attr("class", "bar")
            .attr("x", function(d) {
                if (isVert) { return xScale(d.id); } 
                else { return 0; }
            })
            .attr("y", function(d) {
                if (isVert) { return yScale(d.value); } 
                else { return yScale(d.id); }
            })
            .attr("width", function(d) {
                if (isVert) { return barThickness; } 
                else { return xScale(d.value); }
            })
            .attr("height", function(d) {
                if (isVert) { return height - yScale(d.value); } 
                else { return barThickness; }
            })
            .style("fill", function(d) { 
                return config.color(d.id);
            })
            .on("mousemove", function(d) { events.onMouseMove(d, this, events); })
            .on("mouseover", function(d) { events.onMouseOver(d, this, events); })
            .on("mouseout", function(d) { events.onMouseOut(d, this, events); })
            .on("click", function(d) { events.onClick(d, this, events); });
}