function group(data, config) {

    var margin = config.margin;
    var width = config.dimension.width;
    var height = config.dimension.height;
    var hoverOpacity = config.hoverOpacity;
    var color = d3.scale.ordinal()
        .range(config.colors);

    var nData = data.nData;

    d3.select("body").selectAll(".tooltip").remove();
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    // true if tooltip is over bar
    var tooltipFlag = false;
    
    nData.forEach(function(d) {
        d.datasets = data.categories.map(function(name) { return {name: name, value: +d[name]}; });
    });

    // scales
    var xItemScale = d3.scale.ordinal()
        .domain(nData.map(function(d) { return d.item; }))
        .rangeRoundBands([0, width], 0.1);

    var xCategoryScale = d3.scale.ordinal()
    	.domain(data.categories)
    	.rangeRoundBands([0, xItemScale.rangeBand()]);;

    var yScale = d3.scale.linear()
    	.domain([0, d3.max(nData, function(d) { return d3.max(d.datasets, function(d) { return d.value; })})])
        .range([height, 0]);

    // axes
    var xAxis = d3.svg.axis()
        .scale(xItemScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    // set up svg area
    var svg = d3.select("#" + config.targetArea).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    // go through each main item
    var items = svg.selectAll(".item")
        .data(nData)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + xItemScale(d.item) + ", 0)"; });

    // draw the bars
    // TODO: Only make one group's opacity lowered or all groups' lowered
    items.selectAll("rect")
        .data(function(d) { return d.datasets; })
        .enter().append("rect")
            .attr("class", "bar")
            .attr("width", xCategoryScale.rangeBand())
            .attr("x", function(d, i) { return xCategoryScale(d.name); })
            .attr("y", function(d, i) { return yScale(d.value); })
            .attr("height", function(d, i) { return height - yScale(d.value); })
            .style("fill", function(d, i) { return color(d.name); })
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
    
    // add on the axes
    svg.append("g")
        .attr("class", "groupVXAxis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "groupVYAxis")
        .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .style("text-anchor", "end")
                .text("Amount");

    $(".groupVXAxis").click(function(event) {
        var text = $(event.target).text();
        config.callbacks.item(nData, text, data.items.indexOf(text));
    });

    // legend
    var legend = svg.selectAll("legend")
        .data(data.categories.slice().reverse())
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