/**
 *  Partitions the draw target into a 3 by 3 grid that is easier to work with.
 *  Others may not prefer this method and that's okay, but it happens to be 
 *  that this method was convenient for this library.
 *  @param {object} config - includes, target, height, width, and partition dimensions
 */
function genericsvg(config) {
    // assume default 0.1-0.8-0.1 partitioning
    var width = config.width, height = config.height, drawTarget = config.drawTarget,
        hLeft = config.hLeft || 0.1, hMid = config.hMid || 0.8, hRight = config.hRight || 0.1,
        vTop = config.vTop || 0.1, vMid = config.vMid || 0.8, vBot = config.vBot || 0.1;

    var errorPercentage = 0.0001;
    if (Math.abs(hLeft + hMid + hRight - 1) > errorPercentage || Math.abs(vTop + vMid + vBot - 1) > errorPercentage) {
        console.err("FormatError: partition percentages exceed or do not add up to 1");
    }

    d3.select("#" + drawTarget).html("");
    var svg = d3.select("#" + drawTarget).append("svg")
        .attr("width", width).attr("height", height);

    var r1Shift = width * hLeft;
    var r2Shift = width * (hLeft + hMid);
    var b1Shift = height * vTop;
    var b2Shift = height * (vTop + vMid);

    var leftTop = svg.selectAll(".leftTop").data([1]).enter().append("g")
        .attr("width", width * hLeft).attr("height", height * vTop)
        .attr("transform", "translate(0, 0)");

    var leftMid = svg.selectAll(".leftMid").data([1]).enter().append("g")
        .attr("width", width * hLeft).attr("height", height * vMid)
        .attr("transform", "translate(0, " + b1Shift + ")");

    var leftBot = svg.selectAll(".leftBot").data([1]).enter().append("g")
        .attr("width", width * hLeft).attr("height", height * vBot)
        .attr("transform", "translate(0, " + b2Shift + ")");
    
    var midTop = svg.selectAll(".midTop").data([1]).enter().append("g")
        .attr("width", width * hMid).attr("height", height * vTop)
        .attr("transform", "translate(" + r1Shift + ", 0)");

    var midMid = svg.selectAll(".midMid").data([1]).enter().append("g")
        .attr("width", width * hMid).attr("height", height * vMid)
        .attr("transform", "translate(" + r1Shift + ", " + b1Shift + ")");

    var midBot = svg.selectAll(".midBot").data([1]).enter().append("g")
        .attr("width", width * hMid).attr("height", height * vBot)
        .attr("transform", "translate(" + r1Shift + ", " + b2Shift + ")");

    var rightTop = svg.selectAll(".rightTop").data([1]).enter().append("g")
        .attr("width", width * hRight).attr("height", height * vTop)
        .attr("transform", "translate(" + r2Shift + ", 0)");

    var rightMid = svg.selectAll(".rightMid").data([1]).enter().append("g")
        .attr("width", width * hRight).attr("height", height * vMid)
        .attr("transform", "translate(" + r2Shift + ", " + b1Shift + ")");

    var rightBot = svg.selectAll(".rightBot").data([1]).enter().append("g")
        .attr("width", width * hRight).attr("height", height * vBot)
        .attr("transform", "translate(" + r2Shift + ", " + b2Shift + ")");

    return [[leftTop, leftMid, leftBot], [midTop, midMid, midBot], [rightTop, rightMid, rightBot]];
}