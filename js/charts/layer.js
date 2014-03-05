function layer(data, config) {

    var margin = config.margin;
    var width = config.dimension.width;
    var height = config.dimension.height;
    var padding = 10;
    var barPadding = 1;
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

    console.log("data after dataset mod: ");
    console.log(data);

    // set up the necessary data structures
    var categoryData = new Array();
    for (var i = 0; i < mainAxisLabels.length; i++) {
        categoryData.push({ name: mainAxisLabels[i] });
    }

    for (var i = 0; i < mainAxisLabels.length; i++) {
            categoryData[i].setData = []; 
            for (var j = 0; j < data.length; j++) {
                categoryData[i].setData.push({name: data[j].set, value: data[j][categoryData[i].name] });
            }
    }

    console.log("Cateogyr data");
    console.log(categoryData);

    color.domain(mainAxisLabels);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d3.max(d.dataset, function(d) { return d.value; })})])
        .range([0, height]);

    var subChartWidth = (width + margin.left + margin.right) / categoryData.length;
    var subSvg = [];
    for (var i = 0; i < categoryData.length; i++) {
        subSvg[i] = svg.append("g")
                        .attr("y", 0)
                        .attr("width", (subChartWidth) + "px")
                        .attr("height", (height) + "px")
                        .append("g");
    }

    // start plotting the stuff in their unique svg containers
    //for (var ii = 0; ii < categoryData.length; ii++) {
    for (var ii = 0; ii < categoryData.length; ii++) {
        console.log("appending rects");
        subSvg[ii].selectAll("rect")
            .data(categoryData[ii].setData)
            .enter().append("rect")
                .attr("x", function(d, i) { return i * ((subChartWidth - padding) / categoryData.length) + padding + (ii * subChartWidth); })  
                .attr("y", function(d) { return height - yScale(+d.value); })
                .attr("width", (subChartWidth - padding) / categoryData.length - barPadding)
                .attr("height", function(d) { console.log(d.value); return yScale(+d.value); })
                .attr("fill", color(categoryData[ii].name)); // subject to change
    }

/*
    var subChartWidth = width / categoryData.length - 10;
    for (var ii = 0; ii < categoryData.length; ii++) {
        console.log("doing some magic");

        svg.selectAll("rect")
            .data(categoryData[ii].setData)
            .enter().append("rect")
                .attr("x", function(d, i) { return i * ((subChartWidth - padding) / categoryData.length) + padding + (ii * subChartWidth); })  
                .attr("y", function(d) { return height - yScale(+d.value); })
                .attr("width", (subChartWidth - padding) / categoryData.length - barPadding)
                .attr("height", function(d) { return yScale(+d.value); })
                .attr("fill", "steelblue"); // subject to change

*/

/*
        for (var i = 0; i < categoryData[ii].setData.length; i++) {
            console.log("x: " + (i * ((subChartWidth - padding) / categoryData.length) + padding + (ii * subChartWidth)));
            console.log("y: " + (height - yScale(+categoryData[ii].setData[i].value)));
        }
*/
    
}
