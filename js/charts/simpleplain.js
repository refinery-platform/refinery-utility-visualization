function simplePlain(data, config, events) {
	var hAxisDrawSpaceWidth = config.width * 0.90,
        hAxisDrawSpaceHeight = config.height * 0.05,
        vAxisDrawSpaceWidth = config.width * 0.05,
        vAxisDrawSpaceHeight = config.height * 0.90,
        chartDrawSpaceWidth = config.width * 0.90,
        chartDrawSpaceHeight = config.height * 0.90,
        rightPartitionShift = config.width * 0.05,
        bottomPartitionShift = config.height * 0.95,
        topPartitionShift = config.height * 0.05;


    // set up SVG and partition into draw spaces
    var svg = d3.select("#" + config.drawTarget)
        .append("svg")
            .attr("width", config.width)
            .attr("height", config.height);

    // by default each axis takes up 5% of horizontal and vertical respectively
    var horizontalAxisDrawSpace = svg.selectAll(".hAxis")
        .data([1]).enter().append("g").attr("class", "axis")
            .attr("width", hAxisDrawSpaceWidth)
            .attr("height", hAxisDrawSpaceHeight)
            .attr("transform", "translate(" + rightPartitionShift + ", " + bottomPartitionShift + ")")

    var verticalAxisDrawSpace = svg.selectAll(".vAxis")
        .data([1]).enter().append("g").attr("class", "axis")
            .attr("width", vAxisDrawSpaceWidth)
            .attr("height", vAxisDrawSpaceHeight)
            .attr("transform", "translate(" + rightPartitionShift + ", " + topPartitionShift + ")")

    var chartDrawSpace = svg.selectAll(".chart")
        .data([1]).enter().append("g").attr("class", "chart")
            .attr("width", chartDrawSpaceWidth)
            .attr("height", chartDrawSpaceHeight)
            .attr("transform", "translate(" + rightPartitionShift + ", " + topPartitionShift + ")");

    var formatData = []
    for (var i = 0; i < data.items.length; i++) {
    	formatData.push({
    		id: data.items[i],
    		value: data.matrix[i].sum()
    	})
    }

    var gPadding = 20;
    var gWidth = chartDrawSpaceWidth;
    var gHeight = chartDrawSpaceHeight;

    var gSet = chartDrawSpace.selectAll("g")
    	.data([1]).enter().append("g")
    		.attr("width", gWidth)
    		.attr("height", gHeight)
    		.attr("transform", function(d, i) {
    			return "translate(0, 0)";
    		}) 

    var globalMax = formatData.map(function(d) { return d.value; }).max();

    var configSet = {
    	width: gWidth,
    	height: gHeight,
    	orientation: config.orientation,
    	drawTarget: gSet[0][0],
        globalMax: globalMax
    }

    genericPlain(formatData, configSet, events);

    var xScale = d3.scale.linear()
        .domain([0, globalMax])
        .range([0, gWidth]);

    var yScale = d3.scale.ordinal()
        .domain(data.items)
        .rangeRoundBands([0, gHeight], 0)

    var xAxis = d3.svg.axis();
    var yAxis = d3.svg.axis();

    if (config.orientation === "vertical") {
        xScale = d3.scale.ordinal()
            .domain(data.items)
            .rangeRoundBands([0, gWidth], 0)

        yScale = d3.scale.linear()
            .domain([0, globalMax])
            .range([gHeight, 0])

        xAxis.scale(xScale).orient("bottom");
        horizontalAxisDrawSpace.append("g")
            .attr("class", "refinery-utility-axis")
            .call(xAxis);

        yAxis.scale(yScale).orient("left");
        verticalAxisDrawSpace.append("g")
            .attr("class", "refinery-utility-axis")
            .call(yAxis);
    } else {
        xAxis.scale(xScale).orient("bottom");
        horizontalAxisDrawSpace.append("g")
            .attr("class", "refinery-utility-axis")
            .call(xAxis);

        yAxis.scale(yScale).orient("left")
        verticalAxisDrawSpace.append("g")
            .attr("class", "refinery-utility-axis")
            .call(yAxis);
    }
}