function layer(data, config) {

    var margin = config.margin,
        width = config.dimension.width,
        height = config.dimension.height,
        padding = 10,
        barPadding = 3,
        gPadding = 20,
        hoverOpacity = config.hoverOpacity,
        color = d3.scale.ordinal()
        .domain(data.categories)
        .range(config.colors);

    var vYScaleOffset = 50; // to enable the x-axis to display more elegantly

    var nData = data.nData;

    // the tooltip
    d3.select("body").selectAll(".refinery-utility-tooltip").remove();
    var div = d3.select("body").append("div")
        .attr("class", "refinery-utility-tooltip")
        .style("opacity", 0);

    // true if tooltip is over bar
    var tooltipFlag = false;

    var itemLabels = data.categories;

    // set up the necessary data structures
    var itemData = new Array();
    for (var i = 0; i < itemLabels.length; i++) {
        itemData.push({ name: itemLabels[i] });
    }

    for (var i = 0; i < itemLabels.length; i++) {
            itemData[i].setData = []; 
            for (var j = 0; j < nData.length; j++) {
                itemData[i].setData.push({name: nData[j].item, value: nData[j][itemData[i].name] });
            }
    }

    // width of each g
    var gWidth;
    var gHeight;
    gHeight = height;
    gWidth = (width) / itemData.length - 10;
    

    var barThickness = (gWidth - padding) / itemLabels.length;

    // things now sensitive to orientation

    // scales of vertical orientation
    var vXScale = d3.scale.ordinal()
        .domain(data.items)
        .range([0, gWidth - gPadding])

    var vYScale = d3.scale.linear()
        .domain([0, d3.max(nData, function(d) { return d3.max(itemLabels.map(function(name) { return {name: name, value: +d[name]}; }), function(d) { return d.value; })})])
        .range([0, gHeight]);

    // x scale for horizontal orientation
    var hXScale = d3.scale.linear()
        .domain([0, d3.max(nData, function(d) { return d3.max(itemLabels.map(function(name) { return {name: name, value: +d[name]}; }), function(d) { return d.value; })})])
        .range([0, gWidth - gPadding]);

    // set up svg area
    var svg = d3.select("#" + config.targetArea).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
    
    var subSvg = [];
    if (config.orientation == "horizontal") {
        for (var i = 0; i < itemData.length; i++) {
            subSvg[i] = svg.append("g")
                .attr("y", 0)
                .attr("width", (gWidth) + "px")
                .attr("height", (height) + "px")
                .append("g");
        }
    }

    if (config.orientation == "vertical") {
        for (var i = 0; i < itemData.length; i++) {
            subSvg[i] = svg.append("g")
                .attr("x", 0)
                .attr("y", gHeight * i)
                .attr("width", gWidth)
                .attr("height", gHeight)
                .append("g");
        }
    }

    // start plotting the stuff in their unique svg containers
    for (var ii = 0; ii < itemData.length; ii++) {
        var g = subSvg[ii].selectAll("rect")
            .data(itemData[ii].setData)
            .enter().append("rect")
                .attr("class", "bar")
                .attr("x", ii * gWidth + gPadding)
                .attr("y", function(d, i) { return i * (barThickness + barPadding)})
                .attr("width", function(d) { return hXScale(+d.value); }) 
                .attr("height", barThickness)
                .attr("fill", color(itemData[ii].name))
                .on("mouseover", function(d, i) {
                    var gElem = this.parentNode;
                    d3.select(gElem).selectAll(".bar").attr("opacity", hoverOpacity);
                    d3.select(this).attr("opacity", 1);

                    tooltipFlag = true;
                })
                .on("mouseout", function() {
                    var gElem = this.parentNode;
                    d3.select(gElem).selectAll(".bar").attr("opacity", 1);

                    tooltipFlag = false;
                    div.style("opacity", 0);
                })
                .on("mousemove", function(d, i) {
                    if (tooltipFlag) {
                        div.style("opacity", 0.9);

                        div.html(d.value)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY) + "px");
                    }
                })
                .on("click", function(d, i) {
                    config.callbacks.item(nData, d, i);
                });

        // TODO: set up some x-axis stuff
        // make small x-axis for each one
        var hXAxis = d3.svg.axis()
            .scale(hXScale)
            .orient("bottom")

        subSvg[ii].append("g")
            .attr("class", "refinery-utility-axis")
            .attr("transform", "translate(" + (ii * gWidth + gPadding) + ", " + ((barThickness + barPadding) * itemLabels.length + 10)  + ")")
            .call(hXAxis);
    }

    // make the y-axis
    var hYScale = d3.scale.ordinal()
        .rangeRoundBands([0, barThickness * itemLabels.length + 1], 0.1)
        .domain(nData.map(function(d) { return d.item; }))

    var hYAxis = d3.svg.axis()
        .scale(hYScale)
        .orient("left");

    svg.append("g")
        .attr("class", "refinery-utility-axis")
        .call(hYAxis);


    var legend = svg.selectAll(".legend")
        .data(color.domain().slice())
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0, " + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", "0.35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
}