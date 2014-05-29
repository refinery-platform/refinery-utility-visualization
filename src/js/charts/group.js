function group(data, config, events) {

    var isVert = (config.orientation === "vertical")? true : false;
    var hMid = 0.8, vMid = 0.8
    var partitions = genericSVGFormat({
            width: config.width, height: config.height, drawTarget: config.drawTarget});
    var width = config.width * hMid;
    var height = config.height * vMid;
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

    var gPadding = (isVert)? width * 0.01 : height * 0.01;
    var gWidth = (isVert)? width / fData.length - gPadding : width;
    var gHeight = (isVert)? height : height / fData.length - gPadding;
    var gSet = d3.select(partitions[1][1][0][0]).selectAll("g")
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
        scale: (isVert)?
            d3.scale.ordinal().domain(data.items).rangeRoundBands([0, width], 0) :
            d3.scale.linear().domain([0, globalMax]).range([0, gWidth]),
        xShift: 0,
        yShift: 0,
        tickSize: (isVert)? 0 : 6
    })

    // y-axis
    genericAxis({
        orientation: "left",
        drawTarget: partitions[0][1][0][0],
        scale: (isVert)?
            d3.scale.linear().domain([0, globalMax]).range([height, 0]) :
            d3.scale.ordinal().domain(data.items.reverse()).rangeRoundBands([height, 0], 0),
        xShift: config.width * 0.1,
        yShift: 0,
        tickSize: (isVert)? 6 : 0
    })
}