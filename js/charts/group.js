function group(data, config) {

    console.log(data);

    var datasets = [];
    // loop over each category
    for (var i = 0; i < data.categories.length; i++) {
        // loop over each item of the category
        var itemArr = [];
        for (var j = 0; j < data.matrix[i].length; j++) {
            itemArr.push({
                id: data.categories[i] + "-" + data.items[j],
                value: data.matrix[i][j]
            });
        }
        datasets.push(itemArr);
    }

    var svg = d3.select("#" + config.targetArea)
        .append("svg")
            .attr("width", config.dimension.width)
            .attr("height", config.dimension.height);

    var gs = svg.selectAll("g")
        .data(datasets)
        .enter()
        .append("g")
            .attr("transform", function(d, i) { return "translate(" + (i * config.dimension.width / datasets.length) + ", 0)"; });

    var globalMax = data.matrix.map(function(d) { return d.max(); }).max();

    var configset = [];

    for (var i = 0; i < gs[0].length; i++) {
        configset.push({
            width: config.dimension.width / datasets.length,
            height: config.dimension.height,
            orientation: config.orientation,
            drawTarget: gs[0][i],
            globalMax: globalMax
        });
    }

    console.log(configset);


    for (var i = 0; i < datasets.length; i++) {
        genericPlain(datasets[i], configset[i]);
    }
}