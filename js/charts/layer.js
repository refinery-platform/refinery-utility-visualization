function layer(data, config) {

    var margin = config.margin;
    var width = config.dimension.width;
    var height = config.dimension.height;
    var color = d3.scale.ordinal()
        .range(config.colors);

    // set up svg area
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


	// require individual grid for data
    console.log("displaying data");
	console.log(data);

    color.domain(data.map(function(d) { return d.set}));

    var categories = d3.keys(data[0]).filter(function(key) { return key !== "set"; });

    // we need to define a new plot for each data d1-dn
    var plotWidth = width / categories.length - 20;

    // base scale off of th enew plotWidth Domain -> each category
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, plotWidth], 0.1)
        .domain(data.map(function(d) { return d.set; }));

    var x1 = d3.scale.ordinal();
    
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

    /*
        We need object that holds elements for categories d1-dn such that
        d[n] = { "dn", setData = [someA, someB, etc]}
    */
    
    // transofrm categories elements to objects as opposed to old stirngs
    for (var i = 0; i < categories.length; i++) {
        categories[i] = { name: categories[i] };
    }

    // append various someA, someB, etc values
    for (var i = 0; i < categories.length; i++) {
        categories[i].setData = []; 
        for (var j = 0; j < data.length; j++) {
            categories[i].setData.push({ name: data[j].set, value: data[j][categories[i].name]});
        }
    }

    console.log(categories);

    // configure scales a bit. Each plot has unique y-axis and scale
    x1.domain(data.map(function(d) { return (d.set); }))
        .rangeRoundBands([0, x.rangeBand()]);

    var yScales = [];
    for (var i = 0; i < categories.length; i++) {
        yScales.push(d3.scale.linear()
            .range([height, 0])
            .domain([0, d3.max(categories[i].setData, function(d) { return +d.value; })]))
    }

    // let's loop through each category and plot it
    var cats = svg.selectAll(".categories")
        .data(categories)
        .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d, i) { return "translate(" + i * (plotWidth + 29) + ", " + height + ")"});

    // inner looping
    for (var i = 0; i < categories.length; i++) {
        cats.selectAll("rect")
            .data(categories)
            .enter().append("rect")
                .attr("width", x1.rangeBand())
                .attr("x", function(d) { return })
    }
}
