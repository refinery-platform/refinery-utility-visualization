/**
 *  Draws a plain bar chart in a target area with bar lengths relative to a
 *  global maximum. Also pass in events so they can be attached as well as 
 *  configurations such as orientation, dimensions, etc. Generic plain does 
 *  not plot axes or labels - that is the purpose of generic axis.
 *  @param {object} data - an array of numbers to work with
 *  @param {object} config - contains orientation, dimension, draw target, etc
 *  @param {object} events - attach mouse events to the bars. May have noticed some redundancy, but that's not a big issue
 */
function genericplain(data, config, events) {
    var isVert = (config.orientation === "vertical")? true : false, 
        width = config.width, 
        height = config.height, 
        globalMax = config.globalMax,
        color = config.color || d3.scale.category10().domain(data.map(function(d) { return d.id; })),
        barPadding = config.barPadding || (isVert)? 0.01 * width : 0.01 * height,
        barThickness =  config.barThickness || ((isVert)? width : height) / data.length - barPadding,
        xScale = config.xScale || ((isVert)? d3.scale.ordinal().domain(data.map(function(d) { return d.id; })).rangeRoundBands([0, width], 0.05)
                                    : d3.scale.linear().domain([0, globalMax]).range([0, width])),
        yScale = config.yScale || ((isVert)? d3.scale.linear().domain([0, globalMax]).range([height, 0])
                                    : d3.scale.ordinal().domain(data.map(function(d) { return d.id; })).rangeRoundBands([0, height], 0.05));

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
                return color(d.id);
            })
            .on("mousemove", function(d) { events.onMouseMove(d, this, events, config.barCallbacks); })
            .on("mouseover", function(d) { events.onMouseOver(d, this, events, config.barCallbacks); })
            .on("mouseout", function(d) { events.onMouseOut(d, this, events, config.barCallbacks); })
            .on("click", function(d) { events.onClick(d, this, events, config.barCallbacks); });
}