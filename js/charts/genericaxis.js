function genericAxis(config) {
    
    var orientation = config.orientation, drawTarget = config.drawTarget, 
        scale = config.scale, xShift = config.xShift || 0, yShift = config.yShift || 0,
        axisClass = config.axisClass || "refinery-utility-axis", blank = config.blank || false;

    if (blank) {
    	axisClass = "refinery-utility-blankaxis";
    }

    var axis = d3.svg.axis().scale(scale).orient(orientation);

    d3.select(drawTarget).selectAll("axis").data([1]).enter().append("g")   
        .attr("class", axisClass)
        .attr("transform", "translate(" + xShift + ", " + yShift + ")")
        .call(axis)
}