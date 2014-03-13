function layer(data, config) {

    var margin = config.margin;
    var width = config.dimension.width;
    var height = config.dimension.height;
    var padding = 10;
    var barPadding = 3;
    var gPadding = 20;
    var hoverOpacity = config.hoverOpacity;
    var color = d3.scale.ordinal()
        .domain(data.categories)
        .range(config.colors);
    var vYScaleOffset = 50; // to enable the x-axis to display more elegantly

    var nData = data.nData;

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
    var gWidth = (width) / itemData.length - 10;
    var barThickness = (gWidth - padding) / itemLabels.length;

    // things now sensitive to orientation

    // y scale of vertical orientation
    var vYScale = d3.scale.linear()
        .domain([0, d3.max(nData, function(d) { return d3.max(itemLabels.map(function(name) { return {name: name, value: +d[name]}; }), function(d) { return d.value; })})])
        .range([0, height - 50]);

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
    for (var i = 0; i < itemData.length; i++) {
        subSvg[i] = svg.append("g")
                        .attr("y", 0)
                        .attr("width", (gWidth) + "px")
                        .attr("height", (height) + "px")
                        .append("g");
    }

    // start plotting the stuff in their unique svg containers
    for (var ii = 0; ii < itemData.length; ii++) {
        if (config.orientation == "vertical") {
            var g = subSvg[ii].selectAll("rect")
                .data(itemData[ii].setData)
                .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d, i) { return i * ((gWidth - padding) / itemData.length) + padding + (ii * gWidth); })  
                    .attr("y", function(d) { return height - vYScale(+d.value) - vYScaleOffset; })
                    .attr("width", barThickness)
                    .attr("height", function(d) { return vYScale(+d.value); })
                    .attr("fill", color(itemData[ii].name))
                    .on("mouseover", function() {
                        var gElem = this.parentNode;
                        d3.select(gElem).selectAll(".bar").attr("opacity", hoverOpacity);
                        d3.select(this).attr("opacity", 1);
                    })
                    .on("mouseout", function() {
                        var gElem = this.parentNode;
                        d3.select(gElem).selectAll(".bar").attr("opacity", 1);
                    })
                    .on("click", function(d, i) {
                        config.callbacks.item(nData, d, i);
                    });
        } else {
            console.log("doing the horizontal orientation");
            var g = subSvg[ii].selectAll("rect")
                .data(itemData[ii].setData)
                .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", ii * gWidth + gPadding)
                    .attr("y", function(d, i) { return i * (barThickness + barPadding)})
                    .attr("width", function(d) { return hXScale(+d.value); }) 
                    .attr("height", barThickness)
                    .attr("fill", color(itemData[ii].name))
                    .on("mouseover", function() {
                        var gElem = this.parentNode;
                        d3.select(gElem).selectAll(".bar").attr("opacity", hoverOpacity);
                        d3.select(this).attr("opacity", 1);
                    })
                    .on("mouseout", function() {
                        var gElem = this.parentNode;
                        d3.select(gElem).selectAll(".bar").attr("opacity", 1);
                    })
                    .on("click", function(d, i) {
                        config.callbacks.item(nData, d, i);
                    });  
        }
        // TODO: set up some x-axis stuff
        
        if (config.orientation == "vertical") {
            var vXScale = d3.scale.ordinal()
                            .rangeRoundBands([0, gWidth], 0.1)
                            .domain(nData.map(function(d) { return d.item; }));

            var vXAxis = d3.svg.axis()
                            .scale(vXScale)
                            .orient("bottom");

            subSvg[ii].append("g")
                .attr("class", "layerVXAxis")
                .attr("transform", "translate(" + (ii * gWidth) + ", " + (height - vYScaleOffset) + ")")
                .call(vXAxis)
                .selectAll("text")
                	.style("text-anchor", "end")
                	.attr("transform", "rotate(-60)");
        } else {
            // make small x-axis for each one
            var hXAxis = d3.svg.axis()
                .scale(hXScale)
                .orient("bottom")

            subSvg[ii].append("g")
                .attr("class", "layerHXAxis")
                .attr("transform", "translate(" + (ii * gWidth + gPadding) + ", " + ((barThickness + barPadding) * itemLabels.length + 10)  + ")")
                .call(hXAxis);
        }
    }

    // make the y-axis
    if (config.orientation == "vertical") {
        var vYAxis = d3.svg.axis()
            .scale(d3.scale.linear().domain(vYScale.domain().reverse()).range(vYScale.range()))
            .orient("left");

        svg.append("g")
            .attr("class", "layerVYAxis")
            .call(vYAxis);
    } else {
        var hYScale = d3.scale.ordinal()
            .rangeRoundBands([0, barThickness * itemLabels.length + 1], 0.1)
            .domain(nData.map(function(d) { return d.item; }))

        var hYAxis = d3.svg.axis()
            .scale(hYScale)
            .orient("left");

        svg.append("g")
            .attr("class", "layerHYAxis")
            .call(hYAxis);
    }    

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