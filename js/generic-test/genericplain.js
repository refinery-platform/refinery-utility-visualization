function genericPlain(data, config) {
	// set up appropriate x and y scales depending on the orientation and dimensions
	// assume default orientation is horizontal

	config.colors.domain(data.map(function(d) { return d.id; }))

	var xScale = d3.scale.linear()
		.domain([0, data.map(function(d) { return d.value; }).max()])
		.range([0, config.width]);

	var yScale = d3.scale.ordinal()
		.domain(data.map(function(d) { return d.id; }))
		.rangeRoundBands([0, config.height], 0.1)

	if (config.orientation === "vertical") {
		// switch it up for vertical display
	}

	console.log(d3.select(config.drawTarget))

	// display the data
	d3.select(config.drawTarget).selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
			.attr("x", 0)
			.attr("y", function(d) { return yScale(d.id); })
			.attr("width", function(d) { return xScale(d.value); })
			.attr("height", config.height / data.length)
			.style("fill", function(d) { return config.colors(d.id); });

	// tag on some action listeners and necessary callback functions

}