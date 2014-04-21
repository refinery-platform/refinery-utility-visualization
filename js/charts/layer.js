function layer(data, config, events) {

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

    var formatData = [];
    for (var i = 0; i < data.categories.length; i++) {
    	var itemArr = [];
        for (var j = 0; j < data.matrix.length; j++) {
            itemArr.push({
                id: data.categories[i] + "-" + data.items[j],
                value: data.matrix[j][i]
            })
        }
        formatData.push(itemArr);
    }

    var gPadding = 20;
    var gWidth = (config.orientation === "vertical")? chartDrawSpaceWidth : chartDrawSpaceWidth / formatData.length - gPadding;
    var gHeight = (config.orientation === "vertical")? chartDrawSpaceHeight / formatData.length - gPadding : chartDrawSpaceHeight;

    var gSet = chartDrawSpace.selectAll("g")
        .data(formatData).enter().append("g")
            .attr("width", gWidth)
            .attr("height", gHeight)
            .attr("transform", function(d, i) {
                if (config.orientation === "vertical") {
                    return "translate(0, " + (i * (gHeight + gPadding)) + ")";
                } else {
                    return "translate(" + (i * (gWidth + gPadding)) + ", 0)";
                }
            });

    var globalMax = data.matrix.map(function(d) { return d.max(); }).max();

    var configSet = [];
    for (var i = 0; i < gSet[0].length; i++) {
        configSet.push({
            width: gWidth,
            height: gHeight,
            orientation: config.orientation,
            drawTarget: gSet[0][i],
            globalMax: globalMax,
            color: function(n) { return d3.scale.category10().range()[i]; }
        });
    }

    for (var i = 0; i < formatData.length; i++) {
        if (config.orientation === "vertical") {
            configSet[i].color = function(n) { return d3.scale.category10().range().slice(0, formatData.length).reverse()[i]; } 
            genericPlain(formatData[formatData.length - 1 -i], configSet[i], events)
        } else {
            genericPlain(formatData[i], configSet[i], events);
        }
    }

    // some axes magic
    var xScale = d3.scale.linear()
        .domain([0, globalMax])
        .range([0, gWidth])

    var yScale = d3.scale.ordinal()
        .domain(data.items)
        .rangeRoundBands([vAxisDrawSpaceHeight, 0], 0);

    var xAxis = d3.svg.axis();
    var yAxis = d3.svg.axis();

    if (config.orientation === "vertical") {
        xScale = d3.scale.ordinal()
            .domain(data.items)
            .rangeRoundBands([hAxisDrawSpaceWidth, 0], 0);
        xAxis.scale(xScale)
            .orient("bottom");
        horizontalAxisDrawSpace.append("g")
            .attr("class", "refinery-utility-axis")
            .call(xAxis);

        yScale = d3.scale.linear()
            .domain([0, globalMax])
            .range([gHeight, 0]);
        var hgSet = verticalAxisDrawSpace.selectAll("g")
            .data(formatData).enter().append("g")
                .attr("width", vAxisDrawSpaceWidth)
                .attr("height", gHeight)
                .attr("transform", function(d, i) {
                    return "translate(0, " + (i * (gHeight + gPadding)) + ")";
                });
        for (var i = 0; i < hgSet[0].length; i++) {
            d3.select(hgSet[0][i]).append("g")
                .attr("class", "refinery-utility-axis")
                .call(d3.svg.axis().scale(yScale).orient("left"))
        }
    } else {
        var hgSet = horizontalAxisDrawSpace.selectAll("g")
            .data(formatData).enter().append("g")
                .attr("width", gWidth)
                .attr("height", hAxisDrawSpaceHeight)
                .attr("transform", function(d, i) {
                    return "translate(" + (i * (gWidth + gPadding)) + ", 0)";
                });
        for (var i = 0; i < hgSet[0].length; i++) {
            d3.select(hgSet[0][i]).append("g")
                .attr("class", "refinery-utility-axis")
                .call(d3.svg.axis().scale(xScale).orient("bottom"))
        }

        yAxis.scale(yScale)
            .orient("left");
        verticalAxisDrawSpace.append("g")
            .attr("class", "refinery-utility-axis")
            .call(yAxis);
    }
}