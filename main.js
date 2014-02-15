function select(a) {
    d3.select("svg").remove();
    if (a == "plain") {
        plain();
    } else if (a == "stack") {
        stack();
    } else if (a == "group") { 
        group();
    } else if (a == "pie") {
        pie();
    }
}

function plain() {
    //Width and height
    var w = 300;
    var h = 500;
    var barPadding = 1;
    var padding = 30;

    // color scales
    var color = d3.scale.ordinal()
    .range(["#0B609C", "#C64927", "#128F64", "#BE6293", "#DE8A34"]);

    // testing scales
    var scale = d3.scale.linear()
                .range([0, h - 20]); // subject to potential flipping
    
    //Create SVG element
    var svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h);


    d3.tsv("data.tsv", function(error, data) {

        data.forEach(function(d) {
            d.total = (+d.d1) + (+d.d2) + (+d.d3) + (+d.d4) + (+d.d5);
        });

        scale.domain([0, d3.max(data, function(d) { return d.total; })])

        console.log("testing total valuies")
        data.forEach(function(d) {
            console.log("total: " + d.total);
        })
    
        svg.selectAll("rect")
           .data(data)
           .enter()
           .append("rect")
               .attr("x", function(d, i) {
                    return i * ((w - padding) / data.length) + padding;
               })
               .attr("y", function(d) {
                    return h - scale(d.total);
               })
               .attr("width", (w - padding) / data.length - barPadding)
               .attr("height", function(d) {
                    return scale(d.total);
               })
               .attr("fill", function(d) { return color(d.total)});
            
        svg.selectAll("text")
           .data(data)
           .enter()
           .append("text")
           .text(function(d) {
                return d.total;
           })
           .attr("text-anchor", "middle")
           .attr("x", function(d, i) {
                return i * ((w - padding) / data.length) + (w / data.length - barPadding) / 2 + padding;
           })
           .attr("y", function(d) {
                return h - scale(d.total) + 14;
           })
           .attr("font-family", "sans-serif")
           .attr("font-size", "11px")
           .attr("fill", "white");

        var scale2 = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d.total})])
            .range([h - 20, 0]); // subject to potential flipping


        // test the axis
        var yAxis = d3.svg.axis()
                .scale(scale2)
                .orient("left");

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ", 20)")
            .call(yAxis);

    });
}

function pie() {
    var width = 960,
        height = 500,
        radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
                .range(["#0B609C", "#C64927", "#128F64", "#BE6293", "#DE8A34"]);

    var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(0)

    var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.total; });

    var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
                .attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")");

    d3.tsv("data.tsv", function(error, data) {
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
    });

}

function stack() {
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 400 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // x-scale
    var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], 0.1);

    // y-scale - scale relative to width. The domain is 0 to the maximum of all the arrays
    var y = d3.scale.linear()
            .rangeRound([height, 0]);

    // color scale - maps data to color
    var color = d3.scale.ordinal()
            .range(["#0B609C", "#C64927", "#128F64", "#BE6293", "#DE8A34"]);

    // the x-axis
    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

    // create the y-axis
    var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

    // create the svg element reference; appends 
    var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    // append the data and what not
    d3.tsv("data.tsv", function(error, data) {      
        // filter the keys to not include the first set
        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "set"; }));

        // map domain to ranges. I think
        data.forEach(function(d) {
            var y0 = 0;
            d.nums = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}});
            d.total = d.nums[d.nums.length - 1].y1;
        });

        // sort
       data.sort(function(a, b) { return b.total - a.total; }); 

       // set the scales' domains
       x.domain(data.map(function(d) { return d.set; }));
       y.domain([0, d3.max(data, function(d) { return d.total; })]);

       // append xAxis
       svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + height + ")")
            .call(xAxis);

        // append yAxis
        svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)

        // sets
        var set = svg.selectAll(".set")
                .data(data)
                .enter().append("g")
                    .attr("class", "g")
                    .attr("transform", function(d) { return "translate(" + x(d.set) + ", 0)"; });

        // render the sets
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

        // add a legend
        legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

        // add text to the legend
        legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", "0.35em")
                .style("text-anchor", "end")
                .text(function(d) { return d; });
    });
}

function group() {
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        height = 500 - margin.left - margin.right,
        width = 960 - margin.top - margin.bottom;

    // scale used for x-axis
    var x0 = d3.scale.ordinal()
            .rangeRoundBands([0, width], 0.1);

    var x1 = d3.scale.ordinal();

    // the y scale
    var y = d3.scale.linear()
            .range([height, 0]);

    // color scale
    var color = d3.scale.ordinal()
            .range(["#0B609C", "#C64927", "#128F64", "#BE6293", "#DE8A34"]);

    // x-axis
    var xAxis = d3.svg.axis()
            .scale(x0)
            .orient("bottom");

    // y-axis
    var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));

    // the svg thing
    var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    d3.tsv("data.tsv", function(error, data) {
        var dsets = d3.keys(data[0]).filter(function(key) { return key !== "set"; });

        data.forEach(function(d) {
            d.datasets = dsets.map(function(name) { return {name: name, value: +d[name]}; });
        });

        // set domain of x0 scale
        x0.domain(data.map(function(d) { return d.set; }));
        x1.domain(dsets).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(data, function(d) { return d3.max(d.datasets, function(d) { return d.value; })})]);

        // add the x-axis
        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0, " + height + ")")
                .call(xAxis);

        // add the y-axis
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
    });

}