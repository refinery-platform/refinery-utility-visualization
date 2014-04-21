function genericSVGFormat(config, hLeft, hMid, hRight, vTop, vMid, vBot) {
	
	var errorPercentage = 0.0001;
	if (Math.abs(hLeft + hMid + hRight - 1) > errorPercentage || Math.abs(vTop + vMid + vBot - 1) > errorPercentage) {
		console.err("FormatError: partition percentages exceed or do not add up to 1")
	}

	// reset svg just in case
	d3.select("#" + config.drawTarget).html("");

	// set up and partition svg
	var svg = d3.select("#" + config.drawTarget).append("svg")
		.attr("width", config.width).attr("height", config.height);

	var r1Shift = config.width * hLeft;
	var r2Shift = config.width * (hLeft + hMid);
	var b1Shift = config.height * vTop;
	var b2Shift = config.height * (vTop + vMid);

	var topLeft = svg.selectAll(".topLeft").data([1]).enter().append("g")
		.attr("width", config.width * hLeft).attr("height", config.height * vTop)
		.attr("transform", "translate(0, 0)");

	var topMid = svg.selectAll(".topMid").data([1]).enter().append("g")
		.attr("width", config.width * hMid).attr("height", config.height * vTop)
		.attr("transform", "translate(" + r1Shift + ", 0)");

	var topRight = svg.selectAll(".topRight").data([1]).enter().append("g")
		.attr("width", config.width * hRight).attr("height", config.height * vTop)
		.attr("transform", "translate(" + r2Shift + ", 0)");

	var midLeft = svg.selectAll(".midLeft").data([1]).enter().append("g")
		.attr("width", config.width * hLeft).attr("height", config.height * vMid)
		.attr("transform", "translate(0, " + b1Shift + ")");

	var midMid = svg.selectAll(".midMid").data([1]).enter().append("g")
		.attr("width", config.width * hMid).attr("height", config.height * vMid)
		.attr("transform", "translate(" + r1Shift + ", " + b1Shift + ")");

	var midRight = svg.selectAll(".midRight").data([1]).enter().append("g")
		.attr("width", config.width * hRight).attr("height", config.height * vMid)
		.attr("transform", "translate(" + r2Shift + ", " + b1Shift + ")");

	var botLeft = svg.selectAll(".botLeft").data([1]).enter().append("g")
		.attr("width", config.width * hLeft).attr("height", config.height * vBot)
		.attr("transform", "translate(0, " + b2Shift + ")");

	var botMid = svg.selectAll(".botMid").data([1]).enter().append("g")
		.attr("width", config.width * hMid).attr("height", config.height * vBot)
		.attr("transform", "translate(" + r1Shift + ", " + b2Shift + ")");

	var botRight = svg.selectAll(".botRight").data([1]).enter().append("g")
		.attr("width", config.width * hRight).attr("height", config.height * vBot)
		.attr("transform", "translate(" + r2Shift + ", " + b2Shift + ")");

	return {
		topLeft: topLeft, topMid: topMid, topRight: topRight, 
		midLeft: midLeft, midMid: midMid, midRight: midRight,
		botLeft: botLeft, botMid: botMid, botRight: botRight
	}
}