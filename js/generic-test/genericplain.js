function genericPlain(data, config) {
    // set up a few things beforehand
    var vert = "vertical"; // avoid typos because it's used so much
    var barPadding = 2;
    var barThickness = config.width / data.length - barPadding;

    // load scales - default is horizontal
    var xScale = d3.scale.linear()
        .domain([0, config.globalMax])
        .range([0, config.width]);
    
    var yScale = d3.scale.ordinal()
        .domain(data.map(function(d) { return d.id; }))
        .rangeRoundBands([0, config.height], 0);

    d3.select(config.drawTarget).selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
            .attr("x", function(d) {
                if (config.orientaion === vert) {

                } else {
                    return 0;
                }
            })
            .attr("y", function(d) {
                if (config.orientation === vert) {

                } else {
                    return yScale(d.id);
                }
            })
            .attr("width", function(d) {
                if (config.orientation === vert) {

                } else {
                    return xScale(d.value);
                }
            })
            .attr("height", function(d) {
                if (config.orientation === vert) {

                } else {
                    return barThickness;
                }
            })
            .style("fill", function(d) { return config.colors(d.id); });
}