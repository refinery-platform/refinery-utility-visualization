function group(data, config, events) {

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

    // convert to necessary data format
    var formatData = [];

    // loop over each category
    for (var i = 0; i < data.categories.length; i++) {
        // loop over each item of the category
        var itemArr = [];
        for (var j = 0; j < data.matrix[i].length; j++) {
            itemArr.push({
                id: data.categories[i] + "-" + data.items[j],
                value: data.matrix[i][j]
            });
        }
        formatData.push(itemArr);
    }

    var gPadding = 10;
    var gWidth = (config.orientation === "vertical")? chartDrawSpaceWidth / formatData.length - gPadding : chartDrawSpaceWidth;
    var gHeight = (config.orientation === "vertical")? chartDrawSpaceHeight : chartDrawSpaceHeight / formatData.length - gPadding;

    var gSet = chartDrawSpace.selectAll("g")
        .data(formatData).enter().append("g")
            .attr("width", gWidth)
            .attr("height", gHeight)
            .attr("transform", function(d, i) { 
                if (config.orientation === "vertical") {
                   return "translate(" + (i * (gWidth + gPadding)) + ", 0)"; 
                } else {
                    return "translate(0, " + (i * (gHeight + gPadding)) + ")";
                }
            });

    var globalMax = data.matrix.map(function(d) { return d.max(); }).max();

    // unique configurations due to unique g's
    var configSet = [];
    for (var i = 0; i < gSet[0].length; i++) {
        configSet.push({
            width: gWidth,
            height: gHeight,
            orientation: config.orientation,
            drawTarget: gSet[0][i],
            globalMax: globalMax
        });
    }

    for (var i = 0; i < formatData.length; i++) {
        genericPlain(formatData[i], configSet[i], events);
    }

    // now plot the axes
    var xScale = d3.scale.linear()
        .domain([0, globalMax])
        .range([0, hAxisDrawSpaceWidth]);
    var yScale = d3.scale.ordinal()
        .domain(data.items)
        .rangeRoundBands([vAxisDrawSpaceHeight, 0], 0.1);
    var xAxis = d3.svg.axis();
    var yAxis = d3.svg.axis();

    if (config.orientation === "vertical") {
        xScale = d3.scale.ordinal()
            .domain(data.items)
            .rangeRoundBands([0, hAxisDrawSpaceWidth], 0.1)
        xAxis.scale(xScale)
            .orient("bottom")
        horizontalAxisDrawSpace.append("g")
            .attr("class", "refinery-utility-axis")
            .call(xAxis);

        yScale = d3.scale.linear()
            .domain([0, globalMax])
            .range([vAxisDrawSpaceHeight, 0]);
        yAxis.scale(yScale)
            .orient("left");
        verticalAxisDrawSpace.append("g")
            .attr("class", "refinery-utility-axis")
            .call(yAxis);
    } else {
        xAxis.scale(xScale)
            .orient("bottom");
        horizontalAxisDrawSpace.append("g")
            .attr("class", "refinery-utility-axis")
            .call(xAxis);

        yAxis.scale(yScale)
            .orient("left");
        verticalAxisDrawSpace.append("g")
            .attr("class", "refinery-utility-axis")
            .call(yAxis);
    }
}