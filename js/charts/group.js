function group(data, config, events) {

    var hLeft = 0.1, hMid = 0.8, hRight = 0.1,
        vTop = 0.1, vMid = 0.8, vBot = 0.1;
    var partitions = genericSVGFormat({
            width: config.width, height: config.height, drawTarget: config.drawTarget,
            hLeft: hLeft, hMid: hMid, hRight: hRight, vTop: vTop, vMid: vMid, vBot: vBot
        });
    var vert = "vertical";
    var globalMax = data.matrix.map(function(d) { return d.max(); }).max();
    var fData = [];
    for (var i = 0; i < data.items.length; i++) {
        var catArr = [];
        for (var j = 0; j < data.matrix[i].length; j++) {
            catArr.push({
                id: data.items[i] + "-" + data.categories[j],
                value: data.matrix[i][j]
            });
        }
        fData.push(catArr);
    }

    var gPadding = 20;
    var gWidth = (config.orientation === vert)? config.width * hMid / fData.length - gPadding : config.width * hMid;
    var gHeight = (config.orientation === vert)? config.height * vMid : config.height * vMid / fData.length - gPadding;
    var gSet = d3.select(partitions[1][1][0][0]).selectAll("g")
        .data(fData).enter().append("g")
            .attr("width", gWidth)
            .attr("height", gHeight)
            .attr("transform", function(d, i) { 
                if (config.orientation === vert) {
                   return "translate(" + (i * (gWidth + gPadding)) + ", 0)"; 
                } else {
                    return "translate(0, " + (i * (gHeight + gPadding)) + ")";
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
            color: d3.scale.category10().domain(fData[i].map(function(d) { return d.id; }))
        });
    }   

    for (var i = 0; i < fData.length; i++) {
        genericPlain(fData[i], configSet[i], events);
    }

    // x-axis
    genericAxis({
        orientation: "bottom",
        drawTarget: partitions[1][2][0][0],
        scale: (config.orientation === vert)?
            d3.scale.ordinal().domain(data.items).rangeRoundBands([0, config.width * vMid], 0) :
            d3.scale.linear().domain([0, globalMax]).range([0, gWidth]),
        xShift: 0,
        yShift: 0
    })

    // y-axis
    genericAxis({
        orientation: "left",
        drawTarget: partitions[0][1][0][0],
        scale: (config.orientation === vert)?
            d3.scale.linear().domain([0, globalMax]).range([config.height * vMid, 0]) :
            d3.scale.ordinal().domain(data.items.reverse()).rangeRoundBands([config.height * vMid, 0], 0),
        xShift: hLeft * config.width,
        yShift: 0
    })
}