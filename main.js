/*
    This is a general function that plots a graph of a set of data given an 
    input for the type of graph. In the future perhaps expand to take an array
    of objects as the input as opposed to file I/O on data.tsv
*/

function draw(chartType) {
    // delete old svg so graphs aren't cluttered
    d3.select("svg").remove();

    // TODO: give width and maybe height dynamic scaling based on data size
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 640 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // general color scale
    var color = d3.scale.ordinal()
        .range(["#0B609C", "#C64927", "#128F64", "#BE6293", "#DE8A34"]);

    // new svg area
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    // general functions depending on graph rendered
    d3.tsv("data.tsv", function(error, data) {
        if (chartType == "plain") {
            plain(data);
        } else if (chartType == "stack") {
            stack(data);
        } else if (chartType == "layer") {
            layer(data);
        } else if (chartType == "group") {
            group(data);
        } else if (chartType == "pie") {
            pie(data);
        } else {
            alert("Invalid chart type");
        }
    });


    // specific chart functions to be called
    function plain(data) {
        // a few things unique to this chart
        var padding = 30;
        var barPadding = 1;

        data.forEach(function(d) {
            d.total = (+d.d1) + (+d.d2) + (+d.d3) + (+d.d4) + (+d.d5);
        });

        color.domain(data.map(function(d) { return d.set; }));


        // scales
        var scale = d3.scale.linear()
            .range([0, height - 20])
            .domain([0, d3.max(data, function(d) { return d.total; })]);

        // draw the rectangles
        svg.selectAll("rect")
            .data(data)
            .enter().append("rect")
                .attr("x", function(d, i) { return i * ((width - padding) / data.length) + padding; })
                .attr("y", function(d) { return height - scale(d.total); })
                .attr("width", (width - padding) / data.length - barPadding)
                .attr("height", function(d) { return scale(d.total); })
                .attr("fill", function(d) { return color(d.set); });

        svg.selectAll("text")
            .data(data)
            .enter().append("text")
            .text(function(d) { return d.total; })
                .attr("text-anchor", "middle")
                .attr("x", function(d, i) { return i * ((width - padding) / data.length) + (width / data.length - barPadding) / 2 + padding; })
                .attr("y", function(d) { return height - scale(d.total) + 14; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("fill", "white");

        var axisScale = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d.total; })])
            .range([height - 20, 0]);

        var yAxis = d3.svg.axis()
            .scale(axisScale)
            .orient("left");

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ", 20)")
            .call(yAxis);

        // add the legends        
        var legend = svg.selectAll(".legend")
            .data(data.map(function(d) { return d.set; }))
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

    function stack(data) {
        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], 0.1);

        var y = d3.scale.linear()
            .rangeRound([height, 0]);

        var xAxis = d3.svg.axis()
           .scale(x)
           .orient("bottom");

        var yAxis = d3.svg.axis()
           .scale(y)
           .orient("left");

        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "set"; }));

        data.forEach(function(d) {
            var y0 = 0;
            d.nums = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}});
            d.total = d.nums[d.nums.length - 1].y1;
        });

        data.sort(function(a, b) { return b.total - a.total; }); 

        x.domain(data.map(function(d) { return d.set; }));
        y.domain([0, d3.max(data, function(d) { return d.total; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        var set = svg.selectAll(".set")
            .data(data)
            .enter().append("g")
                .attr("class", "g")
                .attr("transform", function(d) { return "translate(" + x(d.set) + ", 0)"; });

        set.selectAll("rect")
            .data(function(d) { return d.nums; })
            .enter().append("rect")
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.y1); })
                .attr("height", function(d) { return y(d.y0) - y(d.y1); })
                .style("fill", function(d) { return color(d.name)});

        var legend = svg.selectAll(".legend")
            .data(color.domain().slice().reverse())
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

    function layer(data) {
    	// require individual grid for data
        console.log("displaying data");
    	console.log(data);

        var categories = d3.keys(data[0]).filter(function(key) { return key !== "set"; });

        // we need to define a new plot for each data d1-dn
        var plotWidth = width / categories.length - 20;

        // base scale off of th enew plotWidth
        var x = d3.scale.ordinal()
            .rangeRoundBands([0, plotWidth], 0.1)
            .domain(data.map(function(d) { return d.set; }));

        var y = d3.scale.linear()
            .range([height, 0]);

        // we need an axis for each plot
        var xAxes = new Array(categories.length);
        for (var i = 0; i < xAxes.length; i++) {
            xAxes[i] = d3.svg.axis()
                .scale(x)
                .orient("bottom");
        }

        for (var i = 0; i < xAxes.length; i++) {
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + i * (plotWidth + 29) + ", " + height + ")")
                .call(xAxes[i]);
        }

        
    }

    function group(data) {
        var x0 = d3.scale.ordinal()
            .rangeRoundBands([0, width], 0.1);

        var x1 = d3.scale.ordinal();

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x0)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));

        var dsets = d3.keys(data[0]).filter(function(key) { return key !== "set"; });

        data.forEach(function(d) {
            d.datasets = dsets.map(function(name) { return {name: name, value: +d[name]}; });
        });

        x0.domain(data.map(function(d) { return d.set; }));
        x1.domain(dsets).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(data, function(d) { return d3.max(d.datasets, function(d) { return d.value; })})]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
                .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", "0.71em")
                    .style("text-anchor", "end")
                    .text("Amount");

        var sets = svg.selectAll(".set")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + x0(d.set) + ", 0)"; });

        sets.selectAll("rect")
            .data(function(d) { return d.datasets; })
            .enter().append("rect")
                .attr("width", x1.rangeBand())
                .attr("x", function(d) { return x1(d.name); })
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { return height - y(d.value); })
                .style("fill", function(d) { return color(d.name); });

        var legend = svg.selectAll("legend")
            .data(dsets.slice().reverse())
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

    function pie(data) {
        radius = Math.min(width, height) / 2;

        var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(0)

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.total; });

        // some hacky work around for the pie chart because it requires different svg locations
        d3.select("svg").remove();

        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
                .attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")");

        data.forEach(function(d) {
            d.total = (+d.d1) + (+d.d2) + (+d.d3) + (+d.d4) + (+d.d5);
        });

        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color(d.data.total); });

        g.append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", "0.35em")
            .style("text-anchor", "middle")
            .text(function(d) { return d.data.total; });

        var legend = svg.selectAll(".legend")
        .data(color.domain().slice().reverse())
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0, " + i * 20 + ")"; });

        // add a legend
        legend.append("rect")
            .attr("x", radius + 24)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        // add text to the legend
        
        legend.append("text")
            .attr("x", radius + 54)
            .attr("y", 9)
            .attr("dy", "0.35em")
            .style("text-anchor", "end")
            .text(function(d, i) { return data[i].set; });    
    }
}

