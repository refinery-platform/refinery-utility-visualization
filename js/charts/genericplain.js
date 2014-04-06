function genericPlain(data, config, events) {

    var vert = "vertical"; 
    var barPadding = 2;
    var barThickness = config.height / data.length - barPadding;

    // default orientation is horizontal
    var xScale = d3.scale.linear()
        .domain([0, config.globalMax])
        .range([0, config.width]);
    var yScale = d3.scale.ordinal()
        .domain(data.map(function(d) { return d.id; }))
        .rangeRoundBands([0, config.height], 0);

    if (config.orientation === vert) {
        barThickness = config.width / data.length - barPadding;
        xScale = d3.scale.ordinal()
            .domain(data.map(function(d) { return d.id; }))
            .rangeRoundBands([0, config.width], 0);
        yScale = d3.scale.linear()
            .domain([0, config.globalMax]) 
            .range([config.height, 0]);
    }

    d3.select(config.drawTarget).selectAll("rect")
        .data(data).enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                if (config.orientation === vert) { return xScale(d.id); } 
                else { return 0; }
            })
            .attr("y", function(d) {
                if (config.orientation === vert) { return yScale(d.value); } 
                else { return yScale(d.id); }
            })
            .attr("width", function(d) {
                if (config.orientation === vert) { return barThickness; } 
                else { return xScale(d.value); }
            })
            .attr("height", function(d) {
                if (config.orientation === vert) { return config.height - yScale(d.value); } 
                else { return barThickness; }
            })
            .style("fill", function(d) { 
                return d3.scale.category10().domain(data.map(function(d) { return d.id; }))(d.id);
            })
            .on("mousemove", function(d) { events.onMouseMove(d, this, events); })
            .on("mouseover", function(d) { events.onMouseOver(d, this, events); })
            .on("mouseout", function(d) { events.onMouseOut(d, this, events); })
            .on("click", function(d) { events.onClick(d, this, events); })
}