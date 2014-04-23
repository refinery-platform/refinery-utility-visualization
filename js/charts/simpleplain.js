function simplePlain(data, config, events) {

    var hLeft = 0.1, hMid = 0.8, hRight = 0.1,
        vTop = 0.1, vMid = 0.8, vBot = 0.1;

    var partitions = genericSVGFormat({
            width: config.width, height: config.height, drawTarget: config.drawTarget,
            hLeft: hLeft, hMid: hMid, hRight: hRight,
            vTop: vTop, vMid: vMid, vBot: vBot
        });

    var gWidth = config.width * hMid;
    var gHeight = config.height * vMid;

    var fData = [];
    for (var i = 0; i < data.items.length; i++) {
        fData.push({
            id: data.items[i],
            value: data.matrix[i].sum()
        })
    }

    var globalMax = fData.map(function(d) { return d.value; }).max();

    genericPlain(fData, {
        globalMax: globalMax,
        width: config.width * hMid,
        height: config.height * vMid,
        drawTarget: partitions.midMid[0][0],
        color: d3.scale.category10().domain(fData.map(function(d) { return d.id; }))
    }, events);

    // x-axis
    genericAxis({
        orientation: "bottom",
        drawTarget: partitions.botMid[0][0],
        scale: (config.orientation === "vertical")?
            d3.scale.ordinal().domain(data.items).rangeRoundBands([0, gWidth], 0) : 
            d3.scale.linear().domain([0, globalMax]).range([0, gWidth]),
        xShift: 0,
        yShift: 0
    })

    // y-axis
    genericAxis({
        orientation: "left",
        drawTarget: partitions.midLeft[0][0],
        scale: (config.orientation === "vertical")?
            d3.scale.linear().domain([0, globalMax]).range([0, gHeight]) :
            d3.scale.ordinal().domain(data.items.reverse()).rangeRoundBands([gHeight, 0], 0),
        xShift: hLeft * config.width,
        yShift: 0
    })
}