/**
 *  Plots a simple bar chart
 *  @param {object} data - the data set to work with
 *  @param {object} config - various configurations for the chart
 *  @param {object} barEvents - set of barEvents to be attached to the chart
 */
function simplePlain(data, config, barEvents, labelEvents) {
    var isVert = (config.orientation === "vertical")? true : false;
    var hLeft = 0.1, hMid = 0.8, vMid = 0.8;
    var width = config.width * hMid;
    var height = config.height * vMid;    

    // partition
    var partitions = genericsvg({width: config.width, height: config.height, drawTarget: config.drawTarget});

    // format
    var fData = [];
    for (var i = 0; i < data.items.length; i++) {
        fData.push({
            id: data.items[i],
            value: data.matrix[i].sum()
        });
    }

    // plot
    var globalMax = fData.map(function(d) { return d.value; }).max();
    var gWidth = width;
    var gHeight = height;
    genericplain(fData, {
        globalMax: globalMax,
        orientation: config.orientation,
        width: width,
        height: height,
        drawTarget: partitions[1][1][0][0]
    }, barEvents);

    // x-axis
    genericaxis({
        orientation: "bottom",
        drawTarget: partitions[1][2][0][0],
        tickSize: (isVert)? 0 : 6,
        scale: (isVert)?
            d3.scale.ordinal().domain(data.items).rangeRoundBands([0, gWidth], 0) : 
            d3.scale.linear().domain([0, globalMax]).range([0, gWidth]),
        maxLabelSize: (isVert)? (width / fData.length) * 0.9 : 1000
    }, labelEvents);

    // y-axis
    genericaxis({
        orientation: "left",
        drawTarget: partitions[0][1][0][0],
        tickSize: (isVert)? 6 : 0,
        scale: (isVert)?
            d3.scale.linear().domain([0, globalMax]).range([gHeight, 0]) :
            d3.scale.ordinal().domain(data.items.reverse()).rangeRoundBands([gHeight, 0], 0),
        maxLabelSize: config.width * 0.1 * 0.9,
        xShift: hLeft * config.width
    }, labelEvents);
}