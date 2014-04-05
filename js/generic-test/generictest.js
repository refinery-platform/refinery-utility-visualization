/*
    Here we will try to apply the generic plain bar chart by plotting some different types of charts
*/

function genericTest(data, config) {
    
    drawAreaConfig = {
        width: 1000,
        height: 800,
        drawTarget: "draw1"
    }

    data = [
        set1 = [
            {id: "1avocado", value: 4},
            {id: "1banana", value: 9},
            {id: "1cat", value: 5},
            {id: "1dora", value: 7},
            {id: "1elephant", value: 6}
        ],
        set2 = [
            {id: "2avocado", value: 1},
            {id: "2banana", value: 2},
            {id: "2cat", value: 3},
            {id: "2dora", value: 4},
            {id: "2elephant", value: 15}
        ]
    ]

    configSet = []

    // set up mock test environment that creates two split generic plains
    var svg = d3.select("#" + drawAreaConfig.drawTarget)
        .append("svg")
            .attr("width", drawAreaConfig.width)
            .attr("height", drawAreaConfig.height)
    
    var gs = svg.selectAll("g")
        .data(data)
        .enter()
        .append("g")
            .attr("transform", function(d, i) { return "translate(" + (i * drawAreaConfig.width / data.length) + ", 0)"; })

    // tricky 2-layer maxing with objects
    var globalMax = data.map(function(d) { return d.map(function(d) { return d.value; }).max(); }).max();

    // create specialized configs
    for (var i = 0; i < gs[0].length; i++) {
        configSet.push({
            width: drawAreaConfig.width / data.length,
            height: drawAreaConfig.height,
            orientation: "vertical",
            drawTarget: gs[0][i],
            globalMax: globalMax
        })
    }

    //draw each of the charts
    for (var i = 0; i < data.length; i++) {
        genericPlain(data[i], configSet[i]);
    }
}