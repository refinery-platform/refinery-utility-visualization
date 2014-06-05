/**
 *  Plots a stacked bar chart
 *  @param {object} data - the data set to work with
 *  @param {object} config - various configurations for the chart
 *  @param {object} events - set of events to be attached to the chart
 */
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
                .on("mousemove", function(d) { events.onMouseMove({id: d.name, value: d.y1 - d.y0}, this, events); })
                .on("mouseover", function(d) { events.onMouseOver({id: d.name, value: d.y1 - d.y0}, this, events); })
                .on("mouseout", function(d) { events.onMouseOut({id: d.name, value: d.y1 - d.y0}, this, events); })
                .on("click", function(d) { events.onClick({id: d.name, value: d.y1 - d.y0}, this, events); });
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
                .on("mousemove", function(d) { events.onMouseMove({id: d.name, value: d.x1 - d.x0}, this, events); })
                .on("mouseover", function(d) { events.onMouseOver({id: d.name, value: d.x1 - d.x0}, this, events); })
                .on("mouseout", function(d) { events.onMouseOut({id: d.name, value: d.x1 - d.x0}, this, events); })
                .on("click", function(d) { events.onClick({id: d.name, value: d.x1 - d.x0}, this, events); });
    }

    // x-axis
    genericAxis({
        orientation: "bottom",
        drawTarget: partitions[1][2][0][0],
        scale: (isVert)?
            d3.scale.ordinal().domain(data.items).rangeRoundBands([0, width], 0) :
            d3.scale.linear().domain([0, itemMax]).range([0, width]),
        tickSize: (isVert)? 0: 6
    });

    // y-axis
    genericAxis({
        orientation: "left",
        drawTarget: partitions[0][1][0][0],
        scale: (isVert)?
            d3.scale.linear().domain([0, itemMax]).range([height, 0]):
            d3.scale.ordinal().domain(data.items).rangeRoundBands([0, height], 0),
        xShift: config.width * 0.1,
        tickSize: (isVert)? 6 : 0
    });
}