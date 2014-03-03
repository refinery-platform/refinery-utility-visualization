function layer(data, config) {

    var margin = config.margin;
    var width = config.dimension.width;
    var height = config.dimension.height;
    var color = d3.scale.ordinal()
        .range(config.colors);

    // set up svg area
    var svg = d3.select("#" + config.targetArea).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    console.log("data:");
    console.log(data);

    var mainAxisLabels = d3.keys(data[0]).filter(function(key) { return key !== "set"; });

    data.forEach(function(d) {
        d.dataset = mainAxisLabels.map(function(name) { return {name: name, value: +d[name]}; });
    })

    // create axis scales
    var mainAxisScale = d3.scale.ordinal()
        .domain(mainAxisLabels)
        .rangeRoundBands([0, width], 0.1);

    var subAxisScale = d3.scale.ordinal()
        .domain(data.map(function(d) { return d.set; }))
        .rangeRoundBands([0], mainAxisScale.rangeBand());

    var yScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d3.max(d.dataset, function(d) { return d.value; })})])
        .range([height, 0]);

    // create axis
    var xMainAxis = d3.svg.axis()
        .scale(mainAxisScale)
        .orient("bottom");

    var xSubAxis = d3.svg.axis()
        .scale(subAxisScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    // plot the main axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xMainAxis);

    // plot the sub axes on top of the main axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(200, 200)")
        .call(xSubAxis);

    console.log(subAxisScale.domain());
    console.log(mainAxisScale.domain());
}
