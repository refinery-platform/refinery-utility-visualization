function genericAxis(config) {
	var orientation = config.orientation, drawTarget = config.drawTarget, 
		scale = config.scale, xShift = config.xShift, yShift = config.yShift;
		
	var axis = d3.svg.axis().scale(scale).orient(orientation);

	d3.select(drawTarget).selectAll("axis").data([1]).enter().append("g")	
		.attr("class", "refinery-utility-axis")
		.attr("transform", "translate(" + xShift + ", " + yShift + ")")
		.call(axis)
}