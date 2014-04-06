function group(data, config, events) {

    // convert to necessary data format
    var formatData = [];

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
        formatData.push(itemArr);
    }

    var svg = d3.select("#" + config.drawTarget)
        .append("svg")
            .attr("width", config.width)
            .attr("height", config.height);

    var gs = svg.selectAll("g")
        .data(formatData)
        .enter()
        .append("g")
            .attr("transform", function(d, i) { return "translate(" + (i * config.width / formatData.length) + ", 0)"; });

    var globalMax = data.matrix.map(function(d) { return d.max(); }).max();

    // unique configurations due to unique g's
    var configset = [];
    for (var i = 0; i < gs[0].length; i++) {
        configset.push({
            width: config.width / formatData.length,
            height: config.height,
            orientation: config.orientation,
            drawTarget: gs[0][i],
            globalMax: globalMax
        });
    }

    for (var i = 0; i < formatData.length; i++) {
        genericPlain(formatData[i], configset[i], events);
    }
}