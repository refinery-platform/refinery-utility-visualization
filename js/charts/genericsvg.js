function genericSVGFormat(config) {

	var width = config.width, height = config.height, drawTarget = config.drawTarget,
		hLeft = config.hLeft, hMid = config.hMid, hRight = config.hRight,
		vTop = config.vTop, vMid = config.vMid, vBot = config.vBot;

	var errorPercentage = 0.0001;
	if (Math.abs(hLeft + hMid + hRight - 1) > errorPercentage || Math.abs(vTop + vMid + vBot - 1) > errorPercentage) {
		console.err("FormatError: partition percentages exceed or do not add up to 1")
	}

	d3.select("#" + drawTarget).html("");
	var svg = d3.select("#" + drawTarget).append("svg")
		.attr("width", width).attr("height", height);

	var r1Shift = width * hLeft;
	var r2Shift = width * (hLeft + hMid);
	var b1Shift = height * vTop;
	var b2Shift = height * (vTop + vMid);

	var topLeft = svg.selectAll(".topLeft").data([1, 2]).enter().append("g")
		.attr("width", width * hLeft).attr("height", height * vTop)
		.attr("transform", "translate(0, 0)");

	var topMid = svg.selectAll(".topMid").data([1]).enter().append("g")
		.attr("width", width * hMid).attr("height", height * vTop)
		.attr("transform", "translate(" + r1Shift + ", 0)");

	var topRight = svg.selectAll(".topRight").data([1]).enter().append("g")
		.attr("width", width * hRight).attr("height", height * vTop)
		.attr("transform", "translate(" + r2Shift + ", 0)");

	var midLeft = svg.selectAll(".midLeft").data([1]).enter().append("g")
		.attr("width", width * hLeft).attr("height", height * vMid)
		.attr("transform", "translate(0, " + b1Shift + ")");

	var midMid = svg.selectAll(".midMid").data([1]).enter().append("g")
		.attr("width", width * hMid).attr("height", height * vMid)
		.attr("transform", "translate(" + r1Shift + ", " + b1Shift + ")");

	var midRight = svg.selectAll(".midRight").data([1]).enter().append("g")
		.attr("width", width * hRight).attr("height", height * vMid)
		.attr("transform", "translate(" + r2Shift + ", " + b1Shift + ")");

	var botLeft = svg.selectAll(".botLeft").data([1]).enter().append("g")
		.attr("width", width * hLeft).attr("height", height * vBot)
		.attr("transform", "translate(0, " + b2Shift + ")");

	var botMid = svg.selectAll(".botMid").data([1]).enter().append("g")
		.attr("width", width * hMid).attr("height", height * vBot)
		.attr("transform", "translate(" + r1Shift + ", " + b2Shift + ")");

	var botRight = svg.selectAll(".botRight").data([1]).enter().append("g")
		.attr("width", width * hRight).attr("height", height * vBot)
		.attr("transform", "translate(" + r2Shift + ", " + b2Shift + ")");

	return {
		topLeft: topLeft, topMid: topMid, topRight: topRight, 
		midLeft: midLeft, midMid: midMid, midRight: midRight,
		botLeft: botLeft, botMid: botMid, botRight: botRight
	}
}