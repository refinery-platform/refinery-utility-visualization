var rfnry = {
    vis: {
        util: (function() {
        
/**
 *  Max function for numerical array found on Stack Overflow
 */
Array.prototype.max = function() {
    var max = 0;
    var i = this.length;
    while (i--) {
        if (max < this[i])
            max = this[i];
    }
    return max;
};

/**
 *  Super optimized numerical sum function from Stack Overflow
 */
Array.prototype.sum = function() {
    var total = 0;
    var i = this.length;
    while (i--) {
        total += this[i];
    }
    return total;
};

/**
 *  Defines a universal bar tooltip
 *  @type {object}
 */
var barTooltip = d3.select("body")
    .append("div")
        .attr("class", "refinery-utility-barTooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("text-align", "center")
        .attr("width", "100px")
        .style("background-color", "#000")
        .style("opacity", "0.8")
        .style("color", "#fff")
        .style("font-weight", "normal")
        .style("font-size", "11.9px")
        .style("border-radius", "3px")
        .style("padding", "1px 4px 1px 4px");

/**
 *  Defines a universal label tooltip
 *  @type {object}
 */
var labelTooltip = d3.select("body")
    .append("div")
        .attr("class", "refinery-utility-labelTooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("text-align", "center")
        .attr("width", "100px")
        .style("background-color", "#000")
        .style("opacity", "0.8")
        .style("color", "#fff")
        .style("font-weight", "normal")
        .style("font-size", "11.9px")
        .style("border-radius", "3px")
        .style("padding", "1px 4px 1px 4px");

/**
 * Mouse events for the cursor as it goes across various bars
 * @type {object}
 */
var barEvents = {
    onMouseMove: function(data, g, barEvents) {
        if (barEvents.barTooltipFlag) {
            barEvents.barTooltip
                .html(data.id + "<br>" + data.value)
                .style("opacity", 0.9)
                .style("top", (d3.event.pageY - 10) + "px")
                .style("left", (d3.event.pageX + 10) + "px");
        }
    },
    onMouseOver: function(data, g, barEvents) {
        barEvents.barTooltipFlag = true;
        d3.select(g.parentNode).selectAll(".bar")
                .attr("opacity", 0.6);
        d3.select(g).attr("opacity", 1);
    },
    onMouseOut: function(data, g, barEvents) {
        barEvents.barTooltipFlag = false;
        d3.select(g.parentNode).selectAll(".bar")
                .attr("opacity", 1);
        barEvents.barTooltip.style("opacity", 0);
    },
    onClick: function(data, g, barEvents) {
        console.log("clicky bar action going on");
    },
    barTooltip: barTooltip,
    barTooltipFlag: false
};

/**
 *  Mouse events for the cursor as it goes across axes labels and others
 *  @type {object}
 */
var labelEvents = {
    onMouseMove: function(data, g, barEvents) {
        if (labelEvents.labelTooltipFlag) {            
            labelTooltip
                .html(data)
                .style("opacity", 0.9)
                .style("top", (d3.event.pageY - 10) + "px")
                .style("left", (d3.event.pageX + 10) + "px");
        }
    },
    onMouseOver: function(data, g, barEvents) {
        labelEvents.labelTooltipFlag = true;
    },
    onMouseOut: function(data, g, barEvents) {
        labelEvents.labelTooltip = false;
        labelTooltip.style("opacity", 0);
    },
    onClick: function(data, g, barEvents) {
        console.log("clicky label action going on");
    },
    lableTooltip: labelTooltip,
    labelTooltipFlag: false
};

/**
 *  Make a 0x0 px test space for get getTextLength / Height functions
 *  @param {string} - Make SVG test space with this string
 */
function makeTestTextSpace(text) {
    d3.selectAll("#test").remove();
    var test = d3.select("body").append("svg")
        .attr("id", "test")
        .attr("width", 0).attr("height", 0)
        .selectAll("text")
        .data([1]).enter().append("text")
            .text(text);

    return test[0][0].getBBox();
}


/**
 *  Gets pixel length of string
 *  @param {string} - The string whose pixel length you want to find
 */
function getTextLength(text) {
    return makeTestTextSpace(text).width;
}


/**
 *  Get pixel height of string
 *  @param {string} - The string whose pixel height you want to find
 */
function getTextHeight(text) {
    return makeTestTextSpace(text).height;
}

/**
 *  Trims a string given a maximum pixel length if the current string exceeds the max pixel length
 *  @param {string} - The string that you want to trim
 *  @param {number} - Upper bound of pixel length the resulting string should have
 */
function trim(text, maxLength) {
    if (getTextLength(text) <= maxLength) {
        // no trimming needed!
        return text;
    }

    // loop until no need to cut down no more
    for (var i = 0; i < (text.length / 2); i++) {
        var tmpText = text.substring(0, text.length / 2 - i) + ".." + text.substring(text.length / 2 + i, text.length);

        if (getTextLength(tmpText) <= maxLength) {
            return tmpText;
        }
    }
}


/**
 *  Draws a plain bar chart in a target area with bar lengths relative to a
 *  global maximum. Also pass in events so they can be attached as well as 
 *  configurations such as orientation, dimensions, etc. Generic plain does 
 *  not plot axes or labels - that is the purpose of generic axis.
 *  @param {object} data - an array of numbers to work with
 *  @param {object} config - contains orientation, dimension, draw target, etc
 *  @param {object} events - attach mouse events to the bars. May have noticed some redundancy, but that's not a big issue
 */
function genericplain(data, config, events) {
    var isVert = (config.orientation === "vertical")? true : false, 
        width = config.width, 
        height = config.height, 
        globalMax = config.globalMax,
        color = config.color || d3.scale.category10().domain(data.map(function(d) { return d.id; })),
        barPadding = config.barPadding || (isVert)? 0.01 * width : 0.01 * height,
        barThickness =  config.barThickness || ((isVert)? width : height) / data.length - barPadding,
        xScale = config.xScale || ((isVert)? d3.scale.ordinal().domain(data.map(function(d) { return d.id; })).rangeRoundBands([0, width], 0)
                                    : d3.scale.linear().domain([0, globalMax]).range([0, width])),
        yScale = config.yScale || ((isVert)? d3.scale.linear().domain([0, globalMax]).range([height, 0])
                                    : d3.scale.ordinal().domain(data.map(function(d) { return d.id; })).rangeRoundBands([0, height], 0));

    d3.select(config.drawTarget).selectAll("rect")
        .data(data).enter().append("rect").attr("class", "bar")
            .attr("x", function(d) {
                if (isVert) { return xScale(d.id); } 
                else { return 0; }
            })
            .attr("y", function(d) {
                if (isVert) { return yScale(d.value); } 
                else { return yScale(d.id); }
            })
            .attr("width", function(d) {
                if (isVert) { return barThickness; } 
                else { return xScale(d.value); }
            })
            .attr("height", function(d) {
                if (isVert) { return height - yScale(d.value); } 
                else { return barThickness; }
            })
            .style("fill", function(d) { 
                return color(d.id);
            })
            .on("mousemove", function(d) { events.onMouseMove(d, this, events); })
            .on("mouseover", function(d) { events.onMouseOver(d, this, events); })
            .on("mouseout", function(d) { events.onMouseOut(d, this, events); })
            .on("click", function(d) { events.onClick(d, this, events); });
}
/**
 *  Partitions the draw target into a 3 by 3 grid that is easier to work with.
 *  Others may not prefer this method and that's okay, but it happens to be 
 *  that this method was convenient for this library.
 *  @param {object} config - includes, target, height, width, and partition dimensions
 */
function genericsvg(config) {
    // assume default 0.1-0.8-0.1 partitioning
    var width = config.width, 
        height = config.height, 
        drawTarget = config.drawTarget,
        hLeft = config.hLeft || 0.1, hMid = config.hMid || 0.8, hRight = config.hRight || 0.1,
        vTop = config.vTop || 0.1, vMid = config.vMid || 0.8, vBot = config.vBot || 0.1;

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
/**
 *  Draws an axes according to the appropriate configurations - there are many
 *  @param {object} config - contains the configurations, but some defaults exist
 */
function genericaxis(config, labelEvents) {
    var orientation = config.orientation, 
        drawTarget = config.drawTarget, 
        scale = config.scale, 
        xShift = config.xShift || 0, 
        yShift = config.yShift || 0, 
        tickSize = config.tickSize || 6, 
        axisClass = config.axisClass || "refinery-utility-axis", 
        blank = config.blank || false;
        maxLabelSize = config.maxLabelSize || Infinity;

    if (blank) {
        axisClass = "refinery-utility-blankaxis";
    }

    var axis = d3.svg.axis().scale(scale).orient(orientation).tickSize(tickSize);

    var g = d3.select(drawTarget);

    g.selectAll("axis").data([1]).enter().append("g")
        .attr("class", axisClass)
        .attr("transform", "translate(" + xShift + ", " + yShift + ")")
            .style("fill", "none")
            .style("stroke", (blank)? "none" : "black")
            .call(axis);
    
    g.selectAll("text")
        .text(function(d) {
            return trim(d, maxLabelSize);
        });

    g.selectAll(".tick")
        .on("mousemove", function(d) { labelEvents.onMouseMove(d, this, labelEvents); })
        .on("mouseover", function(d) { labelEvents.onMouseOver(d, this, labelEvents); })
        .on("mouseout", function(d) { labelEvents.onMouseOut(d, this, labelEvents); })
        .on("click", function(d) { labelEvents.onClick(d, this, labelEvents); });
}
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
            yGraphScale = d3.scale.log().domain([1, globalMax]).range([mainHeight, 0]);
        } else {
            xGraphScale = d3.scale.log().domain([1, globalMax]).range([0, mainWidth]);
            yGraphScale = d3.scale.ordinal().domain(fData.map(function(d) { return d.id; })).rangeRoundBands([0, mainHeight], 0);
        }
    } 

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

    var xAxisScale;
    var yAxisScale;

    if (config.applyLog) {
        if (isVert) {
            xAxisScale = d3.scale.ordinal().domain(data.items).rangeRoundBands([0, mainWidth], 0);
            yAxisScale = d3.scale.log().domain([1, globalMax]).range([mainHeight, 0]);
        } else {
            xAxisScale = d3.scale.log().domain([1, globalMax]).range([0, mainWidth]);
            yAxisScale = d3.scale.ordinal().domain(data.items.reverse()).rangeRoundBands([mainHeight, 0], 0);
        }
    } else {
        if (isVert) {
            xAxisScale = d3.scale.ordinal().domain(data.items).rangeRoundBands([0, mainWidth], 0);
            yAxisScale = d3.scale.linear().domain([0, globalMax]).range([mainHeight, 0]);
        } else {
            xAxisScale = d3.scale.linear().domain([0, globalMax]).range([0, mainWidth]);
            yAxisScale = d3.scale.ordinal().domain(data.items.reverse()).rangeRoundBands([mainHeight, 0], 0);
        }
    }

    // x-axis
    genericaxis({
        orientation: "bottom",
        drawTarget: partitions[1][2][0][0],
        tickSize: (isVert)? 0 : 6,
        scale: xAxisScale,
        maxLabelSize: (isVert)? (mainWidth / fData.length) * 0.9 : 1000
    }, labelEvents);

    // y-axis
    genericaxis({
        orientation: "left",
        drawTarget: partitions[0][1][0][0],
        tickSize: (isVert)? 6 : 0,
        scale: yAxisScale,
        maxLabelSize: config.width * 0.1 * 0.9,
        xShift: hLeft * config.width
    }, labelEvents);
}
/**
 *  Plots a grouped bar chart
 *  @param {object} data - the data set to work with
 *  @param {object} config - various configurations for the chart
 *  @param {object} barEvents - set of barEvents to be attached to the chart
 */
function group(data, config, barEvents, labelEvents) {
    var i = 0;
    var isVert = (config.orientation === "vertical")? true : false;
    var hMid = 0.8, vMid = 0.8;
    var partitions = genericsvg({
            width: config.width, height: config.height, drawTarget: config.drawTarget});
    var width = config.width * hMid;
    var height = config.height * vMid;
    var globalMax = data.matrix.map(function(d) { return d.max(); }).max();
    var fData = [];
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
    for (i = 0; i < gSet[0].length; i++) {
        configSet.push({
            width: gWidth,
            height: gHeight,
            orientation: config.orientation,
            drawTarget: gSet[0][i],
            globalMax: globalMax
        });
    }   

    for (i = 0; i < fData.length; i++) {
        genericplain(fData[i], configSet[i], barEvents);
    }

    // x-axis
    genericaxis({
        orientation: "bottom",
        drawTarget: partitions[1][2][0][0],
        scale: (isVert)?
            d3.scale.ordinal().domain(data.items).rangeRoundBands([0, width], 0) :
            d3.scale.linear().domain([0, globalMax]).range([0, gWidth]),
        xShift: 0,
        yShift: 0,
        tickSize: (isVert)? 0 : 6,
        maxLabelSize: (isVert)? gWidth * 0.9 : 1000
    }, labelEvents);

    // y-axis
    genericaxis({
        orientation: "left",
        drawTarget: partitions[0][1][0][0],
        scale: (isVert)?
            d3.scale.linear().domain([0, globalMax]).range([height, 0]) :
            d3.scale.ordinal().domain(data.items.reverse()).rangeRoundBands([height, 0], 0),
        xShift: config.width * 0.1,
        yShift: 0,
        tickSize: (isVert)? 6 : 0,
        maxLabelSize: config.width * 0.1 * 0.9
    }, labelEvents);
}
/**
 *  Plots a layered bar chart
 *  @param {object} data - the data set to work with
 *  @param {object} config - various configurations for the chart
 *  @param {object} barEvents - set of barEvents to be attached to the chart
 */
function layer(data, config, barEvents, labelEvents) {
    var i = 0;
    var isVert = (config.orientation === "vertical")? true : false;
    var hLeft = 0.1, hMid = 0.8, hRight = 0.1, vTop = 0.1, vMid = 0.8, vBot = 0.1;
    var partitions = genericsvg({
            width: config.width, height: config.height, drawTarget: config.drawTarget,
            hLeft: hLeft, hMid: hMid, hRight: hRight, vTop: vTop, vMid: vMid, vBot: vBot
        });
    var width = config.width * hMid;
    var height = config.height * vMid;
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

    //var gPadding = 0;
    var gPadding = (isVert)? getTextHeight("1234567890") : getTextLength("W");
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
            genericplain(formatData[formatData.length - 1 -i], configSet[i], barEvents);
        } else {
            genericplain(formatData[i], configSet[i], barEvents);
        }
    }

    var aGSet;
    // axes cannot be done like in simple and group due to more partitioning
    // x-axis
    if (isVert) {
        genericaxis({
            orientation: "bottom",
            drawTarget: partitions[1][2][0][0],
            scale: d3.scale.ordinal().domain(data.items).rangeRoundBands([0, gWidth], 0),
            tickSize: 0,
            maxLabelSize: (width / formatData.length) * 0.9,
            yShift: -getTextHeight("W")
        }, labelEvents);
    } else {
        aGSet = d3.select(partitions[1][2][0][0]).selectAll("g")
            .data(formatData).enter().append("g")
                .attr("width", gWidth)
                .attr("height", config.height * vBot)
                .attr("transform", function(d, i) {
                    return "translate(" + (i * (gWidth + gPadding)) + ", 0)";
                });

        for (i = 0; i < aGSet[0].length; i++) {
            genericaxis({
                orientation: "bottom",
                drawTarget: aGSet[0][i],
                scale: d3.scale.linear().domain([0, globalMax]).range([0, gWidth]),
                tickAmt: 3
            }, labelEvents);
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
            genericaxis({
                orientation: "left",
                drawTarget: aGSet[0][i],
                scale: d3.scale.linear().domain([0, globalMax]).range([gHeight, 0]),
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
            scale: d3.scale.ordinal().domain(data.categories).rangeRoundBands([height, 0], 0),
            blank: true,
            maxLabelSize: config.width * 0.1 * 0.9
        }, labelEvents);
    } else {
        genericaxis({
            orientation: "bottom",
            drawTarget: partitions[1][0][0][0],
            scale: d3.scale.ordinal().domain(data.categories).rangeRoundBands([0, width], 0),
            blank: true,
            maxLabelSize: (width / formatData.length) * 0.9,
            yShift: (config.height * 0.1 - getTextHeight("Wgy")) * 0.5
        }, labelEvents);
    }
}
/**
 *  Plots a stacked bar chart
 *  @param {object} data - the data set to work with
 *  @param {object} config - various configurations for the chart
 *  @param {object} barEvents - set of barEvents to be attached to the chart
 */
function stack(data, config, barEvents, labelEvents) {
	
    var isVert = (config.orientation === "vertical")? true : false;
    var globalMax = data.matrix.map(function(d) { return d.max(); }).max();
    var itemMax = data.matrix.map(function(d) { return d.sum(); }).max();
    var color = d3.scale.ordinal().domain(data.categories).range(d3.scale.category10().range());
    var partitions = genericsvg({
        width: config.width, height: config.height, drawTarget: config.drawTarget
    });
    var width = config.width * 0.8, height = config.height * 0.8;

    var nData = [];
    for (var i = 0; i < data.items.length; i++) {
        nData.push({});
        nData[i].item = data.items[i];
        for (var j = 0; j < data.categories.length; j++) {
            nData[i][data.categories[j]] = data.matrix[i][j];
        }
    }

    if (isVert) {
        nData.forEach(function(d) {
            var y0 = 0;
            d.nums = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name] }; });
            d.total = d.nums[d.nums.length - 1].y1;
        });
    } else {
        nData.forEach(function(d) {
            var x0 = 0;
            d.nums = color.domain().map(function(name) { return {name: name, x0: x0, x1: x0 += d[name] }; });
            d.total = d.nums[d.nums.length - 1].x1;
        });
    }

    var xScale = (isVert)? 
        d3.scale.ordinal()
            .domain(nData.map(function(d) { return d.item; }))
            .rangeRoundBands([0, width], 0.1) :
        d3.scale.linear()
            .domain([0, d3.max(nData, function(d) { return d.total; })])
            .range([0, width]);

    var yScale = (isVert)?
        d3.scale.linear()
            .domain([0, d3.max(nData, function(d) { return d.total; })])
            .range([height, 0]) :
        d3.scale.ordinal()
            .domain(nData.map(function(d) { return d.item; }))
            .rangeRoundBands([0, height], 0.1);

    var items;

    if (isVert) {
        items = d3.select(partitions[1][1][0][0]).selectAll(".item")
            .data(nData).enter().append("g")
                .attr("transform", function(d) { return "translate(" + xScale(d.item) + ", 0)"; });

        items.selectAll("rect")
            .data(function(d) { return d.nums; }).enter().append("rect")
                .attr("class", "bar")
                .attr("y", function(d) { return yScale(d.y1); })
                .attr("width", xScale.rangeBand())
                .attr("height", function(d) { return yScale(d.y0) - yScale(d.y1); })
                .style("fill", function(d) { return color(d.name); })
                .on("mousemove", function(d) { barEvents.onMouseMove({id: d.name, value: d.y1 - d.y0}, this, barEvents); })
                .on("mouseover", function(d) { barEvents.onMouseOver({id: d.name, value: d.y1 - d.y0}, this, barEvents); })
                .on("mouseout", function(d) { barEvents.onMouseOut({id: d.name, value: d.y1 - d.y0}, this, barEvents); })
                .on("click", function(d) { barEvents.onClick({id: d.name, value: d.y1 - d.y0}, this, barEvents); });
    } else {
        items = d3.select(partitions[1][1][0][0]).selectAll(".item")
            .data(nData).enter().append("g")
                .attr("transform", function(d) { return "translate(0, " + yScale(d.item) + ")"; });

        items.selectAll("rect")
            .data(function(d) { return d.nums.reverse(); }).enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return xScale(d.x0); })
                .attr("y", function(d) { return yScale(d.name); })
                .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0); })
                .attr("height", yScale.rangeBand())
                .style("fill", function(d) { return color(d.name); })
                .on("mousemove", function(d) { barEvents.onMouseMove({id: d.name, value: d.x1 - d.x0}, this, barEvents); })
                .on("mouseover", function(d) { barEvents.onMouseOver({id: d.name, value: d.x1 - d.x0}, this, barEvents); })
                .on("mouseout", function(d) { barEvents.onMouseOut({id: d.name, value: d.x1 - d.x0}, this, barEvents); })
                .on("click", function(d) { barEvents.onClick({id: d.name, value: d.x1 - d.x0}, this, barEvents); });
    }

    // x-axis
    genericaxis({
        orientation: "bottom",
        drawTarget: partitions[1][2][0][0],
        scale: (isVert)?
            d3.scale.ordinal().domain(data.items).rangeRoundBands([0, width], 0) :
            d3.scale.linear().domain([0, itemMax]).range([0, width]),
        tickSize: (isVert)? 0: 6,
        maxLabelSize: (isVert)? (width / nData.length) * 0.9 : 1000
    }, labelEvents);

    // y-axis
    genericaxis({
        orientation: "left",
        drawTarget: partitions[0][1][0][0],
        scale: (isVert)?
            d3.scale.linear().domain([0, itemMax]).range([height, 0]):
            d3.scale.ordinal().domain(data.items).rangeRoundBands([0, height], 0),
        xShift: config.width * 0.1,
        tickSize: (isVert)? 6 : 0,
        maxLabelSize: config.width * 0.1 * 0.9
    }, labelEvents);
}
/**
 *  Invokes the appropriate chart type and and draws it in a given drawspace.
 *  Clears the draw target as well as removes border "stroke" of text in that drawspace
 *  @param {string} chartType - "simple", "group", "layer", or "stack"
 *  @param {object} config - { height: number, width: number, drawTarget: string, orientation: string }
 *  @param {object} data - { items: Array[string], categories: Array[string], matrix: Array[Array[number]]}
 */
function draw(chartType, config, data) {

    // delete old svg
    d3.select("#" + config.drawTarget).html("");

    // make deep copies for new ones
    var nData = jQuery.extend(true, {}, data);
    var nConfig = jQuery.extend(true, {}, config);
    var nBarEvents = jQuery.extend(true, {}, barEvents);
    var nLabelEvents = jQuery.extend(true, {}, labelEvents);

    if (chartType === "group") {
        group(nData, nConfig, nBarEvents, nLabelEvents);
    } else if (chartType === "layer") {
        layer(nData, nConfig, nBarEvents, nLabelEvents);
    } else if (chartType === "simple") {
        simplePlain(nData, nConfig, nBarEvents, nLabelEvents);
    } else if (chartType === "stack") {
        stack(nData, nConfig, nBarEvents, nLabelEvents);
    } else {
        alert("Invalid chart type");
    }

    d3.select("#" + config.drawTarget).selectAll("text")
        .attr("font-family", "times new roman")
        .attr("font-size", "14px")
        .attr("fill", "black")
        .attr("stroke", "none");

    console.log("applyLog: " + config.applyLog);
}

/**
 *  Wrapper object. Return statement in src/js/wrap/footer.foo
 */
var util = {
  draw: draw
};
            return util;
        })()
    }
}