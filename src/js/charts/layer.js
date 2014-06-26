/**
 *  Plots a layered bar chart
 *  @param {object} data - the data set to work with
 *  @param {object} config - various configurations for the chart
 *  @param {object} barEvents - set of barEvents to be attached to the chart
 */
function layer(data, config, barEvents, labelEvents) {
    var i = 0,
        isVert = (config.orientation === "vertical")? true : false,
        hLeft = 0.1, hMid = 0.8, hRight = 0.1, vTop = 0.1, vMid = 0.8, vBot = 0.1,
        partitions = genericsvg({
            width: config.width, height: config.height, drawTarget: config.drawTarget,
            hLeft: hLeft, hMid: hMid, hRight: hRight, vTop: vTop, vMid: vMid, vBot: vBot
        }),
        mainWidth = config.width * hMid,
        mainHeight = config.height * vMid,
        globalMax = data.matrix.map(function(d) { return d.max(); }).max(),
        fData = [];
    
    for (i = 0; i < data.categories.length; i++) {
        var itemArr = [];
        for (var j = 0; j < data.matrix.length; j++) {
            itemArr.push({
                id: data.items[j] + "-" + data.categories[i],
                value: data.matrix[j][i]
            });
        }
        fData.push(itemArr);
    }

    //var gPadding = 0;
    var gPadding = (isVert)? getTextHeight("1234567890") : getTextLength("W"),
        gWidth = (isVert)? mainWidth : mainWidth / fData.length - gPadding,
        gHeight = (isVert)? mainHeight / fData.length - gPadding : mainHeight,
        gSet = d3.select((isVert)? partitions[1][1][0][0] : partitions[1][1][0][0]).selectAll("g")
        .data(fData).enter().append("g")
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

    var tmpScale2 = d3.scale.category10().range().slice(0, fData.length).reverse();
    function tmpFunc2(n) { return tmpScale2[i]; }
    function tmpGetId(d) { return d.id; }
    for (i = 0; i < fData.length; i++) {
        var xGraphScale,
            yGraphScale;

        if (config.applyLog) {
            if (isVert) {
                xGraphScale = d3.scale.ordinal().domain(fData[fData.length - 1 - i].map(tmpGetId)).rangeRoundBands([0, gWidth], 0);
                yGraphScale = d3.scale.log().domain([1, globalMax]).range([gHeight, 0]);
            } else {
                xGraphScale = d3.scale.log().domain([1, globalMax]).range([0, gWidth]);
                yGraphScale = d3.scale.ordinal().domain(fData[i].map(tmpGetId)).rangeRoundBands([0, gHeight], 0);
            }
        }

        configSet[i].xScale = xGraphScale;
        configSet[i].yScale = yGraphScale;

        if (isVert) {
            configSet[i].color = tmpFunc2;
            genericplain(fData[fData.length - 1 - i], configSet[i], barEvents);
        } else {
            genericplain(fData[i], configSet[i], barEvents);
        }
    }

    var aGSet,
        xAxisLogScale = d3.scale.log().domain([1, globalMax]).range([0, gWidth]),
        yAxisLogScale = d3.scale.log().domain([1, globalMax]).range([gHeight, 0]);

    // axes cannot be done like in simple and group due to more partitioning
    // x-axis
    if (isVert) {
        genericaxis({
            orientation: "bottom",
            drawTarget: partitions[1][2][0][0],
            scale: d3.scale.ordinal().domain(data.items).rangeRoundBands([0, gWidth], 0),
            tickSize: 0,
            maxLabelSize: (mainWidth / fData.length) * 0.9,
            yShift: -getTextHeight("W")
        }, labelEvents);
    } else {
        aGSet = d3.select(partitions[1][2][0][0]).selectAll("g")
            .data(fData).enter().append("g")
                .attr("width", gWidth)
                .attr("height", config.height * vBot)
                .attr("transform", function(d, i) {
                    return "translate(" + (i * (gWidth + gPadding)) + ", 0)";
                });

        for (i = 0; i < aGSet[0].length; i++) {
            genericaxis({
                orientation: "bottom",
                drawTarget: aGSet[0][i],
                scale: (config.applyLog)? xAxisLogScale 
                            : d3.scale.linear().domain([0, globalMax]).range([0, gWidth]),
                tickAmt: 3
            }, labelEvents);
        }
    }

    // y-axis
    if (isVert) {
        aGSet = d3.select(partitions[0][1][0][0]).selectAll("g")
            .data(fData).enter().append("g")
                .attr("width", config.width * hLeft)
                .attr("height", gHeight)
                .attr("transform", function(d, i) {
                    return "translate(0, " + (i * (gHeight + gPadding)) + ")";
                });

        for (i = 0; i < aGSet[0].length; i++) {
            genericaxis({
                orientation: "left",
                drawTarget: aGSet[0][i],
                scale: (config.applyLog)? yAxisLogScale
                            : d3.scale.linear().domain([0, globalMax]).range([gHeight, 0]),
                xShift: config.width * hLeft,
                tickAmt: 3
            }, labelEvents);
        }
    } else {
        genericaxis({
            orientation: "left",
            drawTarget: partitions[0][1][0][0],
            scale: d3.scale.ordinal().domain(data.items).rangeRoundBands([0, gHeight], 0),
            xShift: config.width * hLeft,
            tickSize: 0,
            maxLabelSize: config.width * hLeft * 0.9
        }, labelEvents);
    }

    // add the labels or something
    if (isVert) {
        genericaxis({
            orientation: "right",
            drawTarget: partitions[2][1][0][0],
            scale: d3.scale.ordinal().domain(data.categories).rangeRoundBands([mainHeight, 0], 0),
            blank: true,
            maxLabelSize: config.width * 0.1 * 0.9
        }, labelEvents);
    } else {
        genericaxis({
            orientation: "bottom",
            drawTarget: partitions[1][0][0][0],
            scale: d3.scale.ordinal().domain(data.categories).rangeRoundBands([0, mainWidth], 0),
            blank: true,
            maxLabelSize: (mainWidth / fData.length) * 0.9,
            yShift: (config.height * 0.1 - getTextHeight("Wgy")) * 0.5
        }, labelEvents);
    }
}