function layer(data, config, events) {
    var hLeft = 0.1, hMid = 0.8, hRight = 0.1,
        vTop = 0.1, vMid = 0.8, vBot = 0.1;
    var partitions = genericSVGFormat({
            width: config.width, height: config.height, drawTarget: config.drawTarget,
            hLeft: hLeft, hMid: hMid, hRight: hRight, vTop: vTop, vMid: vMid, vBot: vBot
        });
    var vert = "vertical";
    var globalMax = data.matrix.map(function(d) { return d.max(); }).max();
    var formatData = [];
    for (var i = 0; i < data.categories.length; i++) {
        var itemArr = [];
        for (var j = 0; j < data.matrix.length; j++) {
            itemArr.push({
                id: data.items[j] + "-" + data.categories[i],
                value: data.matrix[j][i]
            })
        }
        formatData.push(itemArr);
    }

    var gPadding = 20;
    var gWidth = (config.orientation === vert)? config.width * hMid : config.width * hMid / formatData.length - gPadding;
    var gHeight = (config.orientation === vert)? config.height * vMid / formatData.length - gPadding : config.height * vMid;
    var gSet = d3.select(partitions[1][1][0][0]).selectAll("g")
        .data(formatData).enter().append("g")
            .attr("width", gWidth)
            .attr("height", gHeight)
            .attr("transform", function(d, i) {
                if (config.orientation === vert) {
                    return "translate(0, " + (i * (gHeight + gPadding)) + ")";
                } else {
                    return "translate(" + (i * (gWidth + gPadding)) + ", 0)";
                }
            });

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
        if (config.orientation === vert) {
            configSet[i].color = function(n) { return d3.scale.category10().range().slice(0, formatData.length).reverse()[i]; } 
            genericPlain(formatData[formatData.length - 1 -i], configSet[i], events)
        } else {
            genericPlain(formatData[i], configSet[i], events);
        }
    }

    // axes cannot be done like in simple and group due to more partitioning
    // x-axis
    if (config.orientation === vert) {
        genericAxis({
            orientation: "bottom",
            drawTarget: partitions[1][2][0][0],
            scale: d3.scale.ordinal().domain(data.items).rangeRoundBands([0, gWidth], 0),
            xShift: 0,
            yShift: 0
        });
    } else {
        var aGSet = d3.select(partitions[1][2][0][0]).selectAll("g")
            .data(formatData).enter().append("g")
                .attr("width", gWidth)
                .attr("height", config.height * vBot)
                .attr("transform", function(d, i) {
                    return "translate(" + (i * (gWidth + gPadding)) + ", 0)";
                });

        for (var i = 0; i < aGSet[0].length; i++) {
            genericAxis({
                orientation: "bottom",
                drawTarget: aGSet[0][i],
                scale: d3.scale.linear().domain([0, globalMax]).range([0, gWidth]),
                xShift: 0,
                yShift: 0
            });
        }
    }

    // y-axis
    if (config.orientation === vert) {
        var aGSet = d3.select(partitions[0][1][0][0]).selectAll("g")
            .data(formatData).enter().append("g")
                .attr("width", config.width * hLeft)
                .attr("height", gHeight)
                .attr("transform", function(d, i) {
                    return "translate(0, " + (i * (gHeight + gPadding)) + ")";
                })

        for (var i = 0; i < aGSet[0].length; i++) {
            genericAxis({
                orientation: "left",
                drawTarget: aGSet[0][i],
                scale: d3.scale.linear().domain([0, globalMax]).range([gHeight, 0]),
                xShift: config.width * hLeft,
                yShift: 0
            });
        }
    } else {
        genericAxis({
            orientation: "left",
            drawTarget: partitions[0][1][0][0],
            scale: d3.scale.ordinal().domain(data.items).rangeRoundBands([0, gHeight], 0),
            xShift: config.width * hLeft,
            yShift: 0
        });
    }
}