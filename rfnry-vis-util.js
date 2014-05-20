var rfnry = {
    vis: {
        util: (function() {

            // some stuff that makes life easier
            Array.prototype.max = function() {
                    var max = 0;
                    var i = this.length;
                    while (i--) {
                            if (max < this[i])
                                    max = this[i];
                    }
                    return max;
            }

            // super optimized sum function found on StackOverflow!
            Array.prototype.sum = function() {
                    var total = 0;
                    var i = this.length;
                    while (i--) {
                            total += this[i];
                    }
                    return total;
            }

            var tooltip = d3.select("body")
                .append("div")
		                .attr("class", "refinery-utility-tooltip")
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

            // give events some fancy functions
            var events = {
                    onMouseMove: function(data, g, events) {
                            if (events.tooltipFlag) {
                                    events.tooltip
                                            .html(data.id + "<br>" + data.value)
                                            .style("opacity", 0.9)
                                            .style("top", (d3.event.pageY - 10) + "px")
                                            .style("left", (d3.event.pageX + 10) + "px");
                            }
                    },
                    onMouseOver: function(data, g, events) {
                            events.tooltipFlag = true;
                            d3.select(g.parentNode).selectAll(".bar")
                                    .attr("opacity", 0.6);
                            d3.select(g).attr("opacity", 1);
                    },
                    onMouseOut: function(data, g, events) {
                            events.tooltipFlag = false;
                            d3.select(g.parentNode).selectAll(".bar")
                                    .attr("opacity", 1);
                            events.tooltip.style("opacity", 0);
                    },
                    onClick: function(data, g, events) {
                            console.log("clicky action going on");
                    },
                    tooltip: tooltip,
                    tooltipFlag: false
            }

            function genericSVGFormat(config) {

                // assume default 0.1-0.8-0.1 partitioning
                var width = config.width, height = config.height, drawTarget = config.drawTarget,
                    hLeft = config.hLeft || 0.1, hMid = config.hMid || 0.8, hRight = config.hRight || 0.1,
                    vTop = config.vTop || 0.1, vMid = config.vMid || 0.8, vBot = config.vBot || 0.1;

                var errorPercentage = 0.0001
                if (Math.abs(hLeft + hMid + hRight - 1) > errorPercentage || Math.abs(vTop + vMid + vBot - 1) > errorPercentage) {
                    console.err("FormatError: partition percentages exceed or do not add up to 1")
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

            ////////////////////////////////////////////////////////////////

            function genericPlain(data, config, events) {
                var width = config.width, height = config.height, globalMax = config.globalMax,
                    isVert = (config.orientation === "vertical")? true : false;
                var barPadding = (isVert)? 0.01 * width : 0.01 * height;
                var barThickness = height / data.length - barPadding;
                var xScale = d3.scale.linear()
                    .domain([0, globalMax])
                    .range([0, width]);
                var yScale = d3.scale.ordinal()
                    .domain(data.map(function(d) { return d.id; }))
                    .rangeRoundBands([0, height], 0);

                if (isVert) {
                    barThickness = width / data.length - barPadding;
                    xScale = d3.scale.ordinal()
                        .domain(data.map(function(d) { return d.id; }))
                        .rangeRoundBands([0, width], 0);
                    yScale = d3.scale.linear()
                        .domain([0, globalMax])
                        .range([height, 0]);
                }

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
                            return config.color(d.id);
                        })
                        .on("mousemove", function(d) { events.onMouseMove(d, this, events); })
                        .on("mouseover", function(d) { events.onMouseOver(d, this, events); })
                        .on("mouseout", function(d) { events.onMouseOut(d, this, events); })
                        .on("click", function(d) { events.onClick(d, this, events); })
            }

            ////////////////////////////////////////////////////////////////

            function genericAxis(config) {

                var orientation = config.orientation,
                    drawTarget = config.drawTarget,
                    scale = config.scale,
                    xShift = config.xShift || 0,
                    yShift = config.yShift || 0,
                    tickAmt = config.tickAmt || 5,
                    tickSize = (config.tickSize === undefined)? 6 : config.tickSize,
                    axisClass = config.axisClass || "refinery-utility-axis",
                    blank = config.blank || false;

                if (blank) {
                    axisClass = "refinery-utility-blankaxis";
                }

                var axis = d3.svg.axis().scale(scale).orient(orientation)
                            .ticks(tickAmt).tickSize(tickSize);

                d3.select(drawTarget).selectAll("axis").data([1]).enter().append("g")
                    .attr("class", axisClass)
                    .attr("transform", "translate(" + xShift + ", " + yShift + ")")
                            .style("fill", "none")
                            .style("stroke", (blank)? "none" : "black")
                    .call(axis)
            }

            ////////////////////////////////////////////////////////////////

            function simplePlain(data, config, events) {

                var isVert = (config.orientation === "vertical")? true : false;
                var hLeft = 0.1, hMid = 0.8, hRight = 0.1, vTop = 0.1, vMid = 0.8, vBot = 0.1;
                var partitions = genericSVGFormat({
                        width: config.width, height: config.height, drawTarget: config.drawTarget});
                var width = config.width * hMid;
                var height = config.height * vMid;
                var fData = [];
                for (var i = 0; i < data.items.length; i++) {
                    fData.push({
                        id: data.items[i],
                        value: data.matrix[i].sum()
                    })
                }
                var globalMax = fData.map(function(d) { return d.value; }).max();
                var gWidth = width;
                var gHeight = height;
                genericPlain(fData, {
                    globalMax: globalMax,
                    orientation: config.orientation,
                    width: width,
                    height: height,
                    drawTarget: partitions[1][1][0][0],
                    color: d3.scale.category10().domain(fData.map(function(d) { return d.id; }))
                }, events);

                // x-axis
                genericAxis({
                    orientation: "bottom",
                    drawTarget: partitions[1][2][0][0],
                    tickSize: (isVert)? 0 : 6,
                    scale: (isVert)?
                        d3.scale.ordinal().domain(data.items).rangeRoundBands([0, gWidth], 0) :
                        d3.scale.linear().domain([0, globalMax]).range([0, gWidth])
                })

                // y-axis
                genericAxis({
                    orientation: "left",
                    drawTarget: partitions[0][1][0][0],
                    tickSize: (isVert)? 6 : 0,
                    scale: (isVert)?
                        d3.scale.linear().domain([0, globalMax]).range([gHeight, 0]) :
                        d3.scale.ordinal().domain(data.items.reverse()).rangeRoundBands([gHeight, 0], 0),
                    xShift: hLeft * config.width
                })
            }

            ////////////////////////////////////////////////////////////////

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

            ////////////////////////////////////////////////////////////////

            function layer(data, config, events) {

                var isVert = (config.orientation === "vertical")? true : false;
                var hLeft = 0.1, hMid = 0.8, hRight = 0.1, vTop = 0.1, vMid = 0.8, vBot = 0.1
                var partitions = genericSVGFormat({
                        width: config.width, height: config.height, drawTarget: config.drawTarget,
                        hLeft: hLeft, hMid: hMid, hRight: hRight, vTop: vTop, vMid: vMid, vBot: vBot
                    });
                var width = config.width * hMid;
                var height = (isVert)? config.height * vMid : config.height * vMid;
                var globalMax = data.matrix.map(function(d) { return d.max(); }).max();
                var formatData = [];
                for (var i = 0; i < data.categories.length; i++) {
                    var itemArr = [];
                    for (var j = 0; j < data.matrix.length; j++) {
                        itemArr.push({
                            id: data.items[j] + "-" + data.categories[i],
                            value: data.matrix[j][i]
                        })
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

                var configSet = [];
                for (var i = 0; i < gSet[0].length; i++) {
                    configSet.push({
                        width: gWidth,
                        height: gHeight,
                        orientation: config.orientation,
                        drawTarget: gSet[0][i],
                        globalMax: globalMax,
                        color: function(n) { return d3.scale.category10().range()[i]; }
                    });
                }

                for (var i = 0; i < formatData.length; i++) {
                    if (isVert) {
                        configSet[i].color = function(n) { return d3.scale.category10().range().slice(0, formatData.length).reverse()[i]; }
                        genericPlain(formatData[formatData.length - 1 -i], configSet[i], events)
                    } else {
                        genericPlain(formatData[i], configSet[i], events);
                    }
                }

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
                    var aGSet = d3.select(partitions[1][2][0][0]).selectAll("g")
                        .data(formatData).enter().append("g")
                            .attr("width", gWidth)
                            .attr("height", config.height * vBot)
                            .attr("transform", function(d, i) {
                                return "translate(" + (i * (gWidth + gPadding)) + ", 0)";
                            });

                    for (var i = 0; i < aGSet[0].length; i++) {
                        genericAxis({
                            orientation: "bottom",
                            drawTarget: aGSet[0][i],
                            scale: d3.scale.linear().domain([0, globalMax]).range([0, gWidth])
                        });
                    }
                }

                // y-axis
                if (isVert) {
                    var aGSet = d3.select(partitions[0][1][0][0]).selectAll("g")
                        .data(formatData).enter().append("g")
                            .attr("width", config.width * hLeft)
                            .attr("height", gHeight)
                            .attr("transform", function(d, i) {
                                return "translate(0, " + (i * (gHeight + gPadding)) + ")";
                            })

                    for (var i = 0; i < aGSet[0].length; i++) {
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
                    })
                } else {
                    genericAxis({
                        orientation: "bottom",
                        drawTarget: partitions[1][0][0][0],
                        scale: d3.scale.ordinal().domain(data.categories).rangeRoundBands([0, width], 0),
                        blank: true,
                        xShift: -config.width * hLeft * 0.2,
                        yShift: config.height * vTop * 0.7
                    })
                }
            }

            ////////////////////////////////////////////////////////////////

            function stack(data, config, events) {

                var isVert = (config.orientation === "vertical")? true : false;
                var globalMax = data.matrix.map(function(d) { return d.max(); }).max();
                var itemMax = data.matrix.map(function(d) { return d.sum(); }).max();
                var color = d3.scale.ordinal().domain(data.categories).range(d3.scale.category10().range());
                var partitions = genericSVGFormat({
                    width: config.width, height: config.height, drawTarget: config.drawTarget
                });
                var width = config.width * 0.8, height = config.height * 0.8;

                var nData = [];
                for (var i = 0; i < data.items.length; i++) {
                    nData.push({});
                    nData[i]["item"] = data.items[i];
                    for (var j = 0; j < data.categories.length; j++) {
                        nData[i][data.categories[j]] = data.matrix[i][j];
                    }
                }

                if (isVert) {
                    nData.forEach(function(d) {
                        var y0 = 0;
                        d.nums = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name] }});
                        d.total = d.nums[d.nums.length - 1].y1;
                    });
                } else {
                    nData.forEach(function(d) {
                        var x0 = 0;
                        d.nums = color.domain().map(function(name) { return {name: name, x0: x0, x1: x0 += d[name] }});
                        d.total = d.nums[d.nums.length - 1].x1;
                    })
                }

                var xScale = (isVert)?
                    d3.scale.ordinal()
                        .domain(nData.map(function(d) { return d.item; }))
                        .rangeRoundBands([0, width], 0.1) :
                    d3.scale.linear()
                        .domain([0, d3.max(nData, function(d) { return d.total; })])
                        .range([0, width])

                var yScale = (isVert)?
                    d3.scale.linear()
                        .domain([0, d3.max(nData, function(d) { return d.total; })])
                        .range([height, 0]) :
                    d3.scale.ordinal()
                        .domain(nData.map(function(d) { return d.item; }))
                        .rangeRoundBands([0, height], 0.1)

                if (isVert) {
                    var items = d3.select(partitions[1][1][0][0]).selectAll(".item")
                        .data(nData).enter().append("g")
                            .attr("transform", function(d) { return "translate(" + xScale(d.item) + ", 0)"; });

                    items.selectAll("rect")
                        .data(function(d) { return d.nums; }).enter().append("rect")
                            .attr("class", "bar")
                            .attr("y", function(d) { return yScale(d.y1); })
                            .attr("width", xScale.rangeBand())
                            .attr("height", function(d) { return yScale(d.y0) - yScale(d.y1); })
                            .style("fill", function(d) { return color(d.name); })
                            .on("mousemove", function(d) { events.onMouseMove({id: d.name, value: d.y1 - d.y0}, this, events); })
                            .on("mouseover", function(d) { events.onMouseOver({id: d.name, value: d.y1 - d.y0}, this, events); })
                            .on("mouseout", function(d) { events.onMouseOut({id: d.name, value: d.y1 - d.y0}, this, events); })
                            .on("click", function(d) { events.onClick({id: d.name, value: d.y1 - d.y0}, this, events); })
                } else {
                    var items = d3.select(partitions[1][1][0][0]).selectAll(".item")
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
                            .on("mousemove", function(d) { events.onMouseMove({id: d.name, value: d.x1 - d.x0}, this, events); })
                            .on("mouseover", function(d) { events.onMouseOver({id: d.name, value: d.x1 - d.x0}, this, events); })
                            .on("mouseout", function(d) { events.onMouseOut({id: d.name, value: d.x1 - d.x0}, this, events); })
                            .on("click", function(d) { events.onClick({id: d.name, value: d.x1 - d.x0}, this, events); })
                }

                // x-axis
                genericAxis({
                    orientation: "bottom",
                    drawTarget: partitions[1][2][0][0],
                    scale: (isVert)?
                        d3.scale.ordinal().domain(data.items).rangeRoundBands([0, width], 0) :
                        d3.scale.linear().domain([0, itemMax]).range([0, width]),
                    tickSize: (isVert)? 0: 6
                })

                // y-axis
                genericAxis({
                    orientation: "left",
                    drawTarget: partitions[0][1][0][0],
                    scale: (isVert)?
                        d3.scale.linear().domain([0, itemMax]).range([height, 0]):
                        d3.scale.ordinal().domain(data.items).rangeRoundBands([0, height], 0),
                    xShift: config.width * 0.1,
                    tickSize: (isVert)? 6 : 0
                })
            }

            function draw(chartType, data, config) {

                // delete old svg
                d3.select("#" + config.drawTarget).html("");

                // make deep copies for new ones
                var nData = jQuery.extend(true, {}, data);
                var nConfig = jQuery.extend(true, {}, config);
                var nEvents = jQuery.extend(true, {}, events);

                if (chartType === "group") {
                    group(nData, nConfig, nEvents);
                } else if (chartType === "layer") {
                    layer(nData, nConfig, nEvents);
                } else if (chartType === "simple") {
                    simplePlain(nData, nConfig, nEvents);
                } else if (chartType === "stack") {
                    stack(nData, nConfig, nEvents);
                } else {
                    alert("Invalid chart type");
                }
            }

            var util = {
              draw: draw
            }

            return util;
        }())
    }
}
