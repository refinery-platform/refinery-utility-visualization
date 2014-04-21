function simplePlain(data, config, events) {

    var hLeft = 0.1, hMid = 0.8, hRight = 0.1,
        vTop = 0.1, vMid = 0.8, vBot = 0.1;

	var partitions = genericSVGFormat(config, hLeft, hMid, hRight, vTop, vMid, vBot);
    var chartDrawSpace = partitions.midMid;
    
    var gPadding = 20;
    console.log("CDRAW SPACE:")
    console.log(chartDrawSpace)
    var gWidth = config.width * hMid;
    var gHeight = config.height * vMid;

    var formatData = []
    for (var i = 0; i < data.items.length; i++) {
        formatData.push({
            id: data.items[i],
            value: data.matrix[i].sum()
        })
    }

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
        globalMax: globalMax,
        color: d3.scale.category10().domain(formatData.map(function(d) { return d.id; }))
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
        partitions.botMid.append("g")
            .attr("class", "refinery-utility-axis")
            .call(xAxis);

        yAxis.scale(yScale).orient("left");
        partitions.midLeft.append("g")
            .attr("class", "refinery-utility-axis")
            .call(yAxis);
    } else {
        xAxis.scale(xScale).orient("bottom");
        partitions.botMid.selectAll("axis").data([1]).enter().append("g")
            .attr("class", "refinery-utility-axis")
            .call(xAxis);

        yAxis.scale(yScale).orient("left")
        partitions.midLeft.selectAll("axis").data([1]).enter().append("g")
            .attr("transform", "translate(" + hLeft * config.width + ", 0)")
            .attr("class", "refinery-utility-axis")
            .call(yAxis);
    }
}