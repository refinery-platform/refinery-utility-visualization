/**
 *  Draws an axes according to the appropriate configurations - there are many
 *  @param {object} config - contains the configurations, but some defaults exist
 */
function genericaxis(config, labelEvents) {
    
    var orientation = config.orientation, 
        drawTarget = config.drawTarget, 
        scale = config.scale, 
        xShift = config.xShift || 0, 
        yShift = config.yShift || 0, 
        tickAmt = config.tickAmt || 5,
        tickSize = (config.tickSize === undefined)? 6 : config.tickSize, 
        axisClass = config.axisClass || "refinery-utility-axis", 
        blank = config.blank || false;
        maxLabelSize = config.maxLabelSize || 1000;

    if (blank) {
        axisClass = "refinery-utility-blankaxis";
    }

    var axis = d3.svg.axis().scale(scale).orient(orientation).ticks(tickAmt).tickSize(tickSize);

    var g = d3.select(drawTarget);

    g.selectAll("axis").data([1]).enter().append("g")
        .attr("class", axisClass)
        .attr("transform", "translate(" + xShift + ", " + yShift + ")")
            .style("fill", "none")
            .style("stroke", (blank)? "none" : "black")
            .call(axis);
    
    g.selectAll("text")
        .text(function(n) {
            return trim(n, maxLabelSize);
        });

    g.selectAll(".tick")
        .on("mousemove", function(d) { 
            labelEvents.onMouseMove(d, this, labelEvents);
        })
        .on("mouseover", function(d) { 
            labelEvents.onMouseOver(d, this, labelEvents);
        })
        .on("mouseout", function(d) {
            labelEvents.onMouseOut(d, this, labelEvents);
        })
        .on("click", function(d) {
            labelEvents.onClick(d, this, labelEvents);
        });
}