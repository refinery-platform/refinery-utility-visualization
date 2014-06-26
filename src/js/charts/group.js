/**
 *  Plots a grouped bar chart
 *  @param {object} data - the data set to work with
 *  @param {object} config - various configurations for the chart
 *  @param {object} barEvents - set of barEvents to be attached to the chart
 */
function group(data, config, barEvents, labelEvents) {
    var i = 0,
        isVert = (config.orientation === "vertical")? true : false,
        color = config.color || d3.scale.category10().range(),
        hMid = 0.8, 
        vMid = 0.8,
        partitions = genericsvg({width: config.width, height: config.height, drawTarget: config.drawTarget}),
        mainWidth = config.width * hMid,
        mainHeight = config.height * vMid,
        globalMax = data.matrix.map(function(d) { return d.max(); }).max(),
        fData = [];

    for (i = 0; i < data.items.length; i++) {
        var catArr = [];
        for (var j = 0; j < data.matrix[i].length; j++) {
            catArr.push({
                id: data.items[i] + "-" + data.categories[j],
                value: data.matrix[i][j]
            });
        }
        fData.push(catArr);
    }

    var gPadding = (isVert)? mainWidth * 0.01 : mainHeight * 0.01,
        gWidth = (isVert)? mainWidth / fData.length - gPadding : mainWidth,
        gHeight = (isVert)? mainHeight : mainHeight / fData.length - gPadding,
        gSet = d3.select(partitions[1][1][0][0]).selectAll("g")
            .data(fData).enter().append("g")
                .attr("width", gWidth)
                .attr("height", gHeight)
                .attr("transform", function(d, i) { 
                    if (isVert) {
                       return "translate(" + (i * (gWidth + gPadding)) + ", 0)"; 
                    } else {
                        return "translate(0, " + (i * (gHeight + gPadding)) + ")";
                    }
                });

    function tmpGetId(d) { return d.id; }

    var configSet = [];
    for (i = 0; i < gSet[0].length; i++) {
        configSet.push({
            width: gWidth,
            height: gHeight,
            orientation: config.orientation,
            drawTarget: gSet[0][i],
            globalMax: globalMax,
            xScale: xGraphScale,
            yScale: yGraphScale,
            color: d3.scale.ordinal().domain(fData[i].map(tmpGetId)).range(color)
        });
    }   

    for (i = 0; i < fData.length; i++) {
        var xGraphScale,
            yGraphScale;

        if (config.applyLog) {
            if (isVert) {
                xGraphScale = d3.scale.ordinal().domain(fData[i].map(tmpGetId)).rangeRoundBands([0, gWidth], 0);
                yGraphScale = d3.scale.log().domain([1, globalMax]).range([gHeight, 0]);
            } else {
                xGraphScale = d3.scale.log().domain([1, globalMax]).range([0, gWidth]);
                yGraphScale = d3.scale.ordinal().domain(fData[i].map(tmpGetId)).rangeRoundBands([0, gHeight], 0);
            }
        }

        configSet[i].xScale = xGraphScale;
        configSet[i].yScale = yGraphScale;

        genericplain(fData[i], configSet[i], barEvents);
    }

    var xAxisScale,
        yAxisScale;

    if (config.applyLog) {
        if (isVert) {
            xAxisScale = d3.scale.ordinal().domain(data.items).rangeRoundBands([0, mainWidth], 0);
            yAxisScale = d3.scale.log().domain([1, globalMax]).range([mainHeight, 0]);
        } else {
            xAxisScale = d3.scale.log().domain([1, globalMax]).range([0, gWidth]);
            yAxisScale = d3.scale.ordinal().domain(data.items.reverse()).rangeRoundBands([mainHeight, 0], 0);
        }
    } else {
        if (isVert) {
            xAxisScale = d3.scale.ordinal().domain(data.items).rangeRoundBands([0, mainWidth], 0);
            yAxisScale = d3.scale.linear().domain([0, globalMax]).range([mainHeight, 0]);
        } else {
            xAxisScale = d3.scale.linear().domain([0, globalMax]).range([0, gWidth]);
            yAxisScale = d3.scale.ordinal().domain(data.items.reverse()).rangeRoundBands([mainHeight, 0], 0);
        }
    }

    // x-axis
    genericaxis({
        orientation: "bottom",
        drawTarget: partitions[1][2][0][0],
        scale: xAxisScale,
        xShift: 0,
        yShift: 0,
        tickSize: (isVert)? 0 : 6,
        maxLabelSize: (isVert)? gWidth * 0.9 : 1000
    }, labelEvents);

    // y-axis
    genericaxis({
        orientation: "left",
        drawTarget: partitions[0][1][0][0],
        scale: yAxisScale,
        xShift: config.width * 0.1,
        yShift: 0,
        tickSize: (isVert)? 6 : 0,
        maxLabelSize: config.width * 0.1 * 0.9
    }, labelEvents);
}