/**
 *  Plots a simple bar chart
 *  @param {object} data - the data set to work with
 *  @param {object} config - various configurations for the chart
 *  @param {object} barEvents - set of barEvents to be attached to the chart
 */
function simplePlain(data, config, barEvents, labelEvents) {
    var isVert = (config.orientation === "vertical")? true : false,
        hLeft = 0.1, hMid = 0.8, vMid = 0.8,
        mainWidth = config.width * hMid,
        mainHeight = config.height * vMid,  
        partitions = genericsvg({width: config.width, height: config.height, drawTarget: config.drawTarget}),
        fData = [];
    
    for (var i = 0; i < data.items.length; i++) {
        fData.push({ id: data.items[i], value: data.matrix[i].sum() });
    }

    var globalMax = fData.map(function(d) { return d.value; }).max();

    var xGraphScale;
    var yGraphScale;

    if (config.applyLog) {
        if (isVert) {
            xGraphScale = d3.scale.ordinal().domain(fData.map(function(d) { return d.id; })).rangeRoundBands([0, mainWidth], 0);
            yGraphScale = function(n) {
                return d3.scale.log().domain([1, globalMax]).range([mainHeight, 0])(n);
                //return mainHeight - d3.scale.log().domain([1, globalMax]).range([mainHeight, 0])(n); 
            };

            console.log(yGraphScale(92));
            console.log(yGraphScale(80));
            console.log(yGraphScale(77));
            console.log(yGraphScale(78));
            console.log(yGraphScale(63));
            console.log(mainHeight);
            console.log("Did them log transformations");
        } else {

        }
    } 

    console.log(xGraphScale);
    console.log(yGraphScale);

    // plot
    genericplain(fData, {
        globalMax: globalMax,
        orientation: config.orientation,
        width: mainWidth,
        height: mainHeight,
        drawTarget: partitions[1][1][0][0],
        xScale: xGraphScale,
        yScale: yGraphScale
    }, barEvents);

    // x-axis
    genericaxis({
        orientation: "bottom",
        drawTarget: partitions[1][2][0][0],
        tickSize: (isVert)? 0 : 6,
        scale: (isVert)? d3.scale.ordinal().domain(data.items).rangeRoundBands([0, mainWidth], 0) 
                    : d3.scale.linear().domain([0, globalMax]).range([0, mainWidth]),
        maxLabelSize: (isVert)? (mainWidth / fData.length) * 0.9 : 1000
    }, labelEvents);

    // y-axis
    genericaxis({
        orientation: "left",
        drawTarget: partitions[0][1][0][0],
        tickSize: (isVert)? 6 : 0,
        scale: (isVert)? d3.scale.linear().domain([0, globalMax]).range([mainHeight, 0]) 
                    : d3.scale.ordinal().domain(data.items.reverse()).rangeRoundBands([mainHeight, 0], 0),
        maxLabelSize: config.width * 0.1 * 0.9,
        xShift: hLeft * config.width
    }, labelEvents);
}