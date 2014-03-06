function layer(data, config) {

    var margin = config.margin;
    var width = config.dimension.width;
    var height = config.dimension.height;
    var padding = 10;
    var barPadding = 3;
    var gPadding = 20;
    var color = d3.scale.ordinal()
        .range(config.colors);

    // set up svg area
    var svg = d3.select("#" + config.targetArea).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    var itemLabels = d3.keys(data[0]).filter(function(key) { return key !== "set"; });

    // set up the necessary data structures
    var itemData = new Array();
    for (var i = 0; i < itemLabels.length; i++) {
        itemData.push({ name: itemLabels[i] });
    }

    for (var i = 0; i < itemLabels.length; i++) {
            itemData[i].setData = []; 
            for (var j = 0; j < data.length; j++) {
                itemData[i].setData.push({name: data[j].set, value: data[j][itemData[i].name] });
            }
    }
    color.domain(itemLabels);

    // width of each g
    var gWidth = (width + margin.left + margin.right) / itemData.length - 10;
    var barThickness = (gWidth - padding) / itemLabels.length;

    // things now sensitive to orientation

    // y scale of vertical orientation
    var vYScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d3.max(itemLabels.map(function(name) { return {name: name, value: +d[name]}; }), function(d) { return d.value; })})])
        .range([0, height]);

    // x scale for horizontal orientation
    var hXScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d3.max(itemLabels.map(function(name) { return {name: name, value: +d[name]}; }), function(d) { return d.value; })})])
        .range([0, gWidth - gPadding]);

    var subSvg = [];
    for (var i = 0; i < itemData.length; i++) {
        subSvg[i] = svg.append("g")
                        .attr("y", 0)
                        .attr("width", (gWidth) + "px")
                        .attr("height", (height) + "px")
                        .append("g");
    }

    // start plotting the stuff in their unique svg containers
    config.orientation = "horizontal";
    for (var ii = 0; ii < itemData.length; ii++) {
        if (config.orientation == "vertical") {
            var g = subSvg[ii].selectAll("rect")
                .data(itemData[ii].setData)
                .enter().append("rect")
                    .attr("x", function(d, i) { return i * ((gWidth - padding) / itemData.length) + padding + (ii * gWidth); })  
                    .attr("y", function(d) { return height - vYScale(+d.value); })
                    .attr("width", barThickness)
                    .attr("height", function(d) { return vYScale(+d.value); })
                    .attr("fill", color(itemData[ii].name)); // subject to change
        } else {
            console.log("doing the horizontal orientation");
            var g = subSvg[ii].selectAll("rect")
                .data(itemData[ii].setData)
                .enter().append("rect")
                    .attr("x", ii * gWidth + gPadding)
                    .attr("y", function(d, i) { return i * (barThickness + barPadding)})
                    .attr("width", function(d) { return hXScale(+d.value); }) 
                    .attr("height", barThickness)
                    .attr("fill", color(itemData[ii].name));  
        }
        // TODO: set up some x-axis stuff
        
        if (config.orientation == "vertical") {
            var vXScale = d3.scale.ordinal()
                            .rangeRoundBands([0, gWidth], 0.1)
                            .domain(data.map(function(d) { return d.set; }));

            var vXAxis = d3.svg.axis()
                            .scale(vXScale)
                            .orient("bottom");

            subSvg[ii].append("g")
                .attr("class", "layerVXAxis")
                .attr("transform", "translate(" + (ii * gWidth) + ", " + (height) + ")")
                .call(vXAxis);
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
            .domain(data.map(function(d) { return d.set; }))

        console.log(hYScale.domain());

        var hYAxis = d3.svg.axis()
            .scale(hYScale)
            .orient("left");

        svg.append("g")
            .attr("class", "layerHYAxis")
            .call(hYAxis);
    }    
}