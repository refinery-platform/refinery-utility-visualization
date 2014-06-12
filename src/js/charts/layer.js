/**
 *  Plots a layered bar chart
 *  @param {object} data - the data set to work with
 *  @param {object} config - various configurations for the chart
 *  @param {object} events - set of events to be attached to the chart
 */
function layer(data, config, events) {

    var i = 0;
    var isVert = (config.orientation === "vertical")? true : false;
    var hLeft = 0.1, hMid = 0.8, hRight = 0.1, vTop = 0.1, vMid = 0.8, vBot = 0.1;
    var partitions = genericSVGFormat({
            width: config.width, height: config.height, drawTarget: config.drawTarget,
            hLeft: hLeft, hMid: hMid, hRight: hRight, vTop: vTop, vMid: vMid, vBot: vBot
        });
    var width = config.width * hMid;
    var height = (isVert)? config.height * vMid : config.height * vMid;
    var globalMax = data.matrix.map(function(d) { return d.max(); }).max();
    var formatData = [];
    for (i = 0; i < data.categories.length; i++) {
        var itemArr = [];
        for (var j = 0; j < data.matrix.length; j++) {
            itemArr.push({
                id: data.items[j] + "-" + data.categories[i],
                value: data.matrix[j][i]
            });
        }
        formatData.push(itemArr);
    }

    var gPadding = (isVert)? width * 0.05 : height * 0.05;
    var gWidth = (isVert)? width : width / formatData.length - gPadding;
    var gHeight = (isVert)? height / formatData.length - gPadding : height;
    var gSet = d3.select((isVert)? partitions[1][1][0][0] : partitions[1][1][0][0]).selectAll("g")
        .data(formatData).enter().append("g")
            .attr("width", gWidth)
            .attr("height", gHeight)
            .attr("transform", function(d, i) {
                if (isVert) {
                    return "translate(0, " + (i * (gHeight + gPadding)) + ")";
                } else {
                    return "translate(" + (i * (gWidth + gPadding)) + ", 0)";
                }
            });

    var tmpScale = d3.scale.category10().range();
    function tmpFunc(n) { return tmpScale[i]; }

    var configSet = [];
    for (i = 0; i < gSet[0].length; i++) {
        configSet.push({
            width: gWidth,
            height: gHeight,
            orientation: config.orientation,
            drawTarget: gSet[0][i],
            globalMax: globalMax,
            color: tmpFunc
        });
    }

    var tmpScale2 = d3.scale.category10().range().slice(0, formatData.length).reverse();
    function tmpFunc2(n) { return tmpScale[i]; }
    for (i = 0; i < formatData.length; i++) {
        if (isVert) {
            configSet[i].color = tmpFunc2;
            genericPlain(formatData[formatData.length - 1 -i], configSet[i], events);
        } else {
            genericPlain(formatData[i], configSet[i], events);
        }
    }

    var aGSet;
    // axes cannot be done like in simple and group due to more partitioning
    // x-axis
    if (isVert) {
        genericAxis({
            orientation: "bottom",
            drawTarget: partitions[1][2][0][0],
            scale: d3.scale.ordinal().domain(data.items).rangeRoundBands([0, gWidth], 0),
            yShift: -config.height * vBot * 0.55,
            tickSize: 0
        });
    } else {
        aGSet = d3.select(partitions[1][2][0][0]).selectAll("g")
            .data(formatData).enter().append("g")
                .attr("width", gWidth)
                .attr("height", config.height * vBot)
                .attr("transform", function(d, i) {
                    return "translate(" + (i * (gWidth + gPadding)) + ", 0)";
                });

        for (i = 0; i < aGSet[0].length; i++) {
            genericAxis({
                orientation: "bottom",
                drawTarget: aGSet[0][i],
                scale: d3.scale.linear().domain([0, globalMax]).range([0, gWidth])
            });
        }
    }

    // y-axis
    if (isVert) {
        aGSet = d3.select(partitions[0][1][0][0]).selectAll("g")
            .data(formatData).enter().append("g")
                .attr("width", config.width * hLeft)
                .attr("height", gHeight)
                .attr("transform", function(d, i) {
                    return "translate(0, " + (i * (gHeight + gPadding)) + ")";
                });

        for (i = 0; i < aGSet[0].length; i++) {
            genericAxis({
                orientation: "left",
                drawTarget: aGSet[0][i],
                scale: d3.scale.linear().domain([0, globalMax]).range([gHeight, 0]),
                xShift: config.width * hLeft,
                tickAmt: 3
            });
        }
    } else {
        genericAxis({
            orientation: "left",
            drawTarget: partitions[0][1][0][0],
            scale: d3.scale.ordinal().domain(data.items).rangeRoundBands([0, gHeight], 0),
            xShift: config.width * hLeft,
            tickSize: 0
        });
    }

    // add the labels or something
    if (isVert) {
        genericAxis({
            orientation: "right",
            drawTarget: partitions[2][1][0][0],
            scale: d3.scale.ordinal().domain(data.categories).rangeRoundBands([height, 0], 0),
            blank: true
        });
    } else {
        genericAxis({
            orientation: "bottom",
            drawTarget: partitions[1][0][0][0],
            scale: d3.scale.ordinal().domain(data.categories).rangeRoundBands([0, width], 0),
            blank: true,
            xShift: -config.width * hLeft * 0.2,
            yShift: config.height * vTop * 0.7
        });
    }

    d3.select(partitions[2][1][0][0]).selectAll("text")
        .attr("hue", "oh this is it");
}