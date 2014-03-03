/*
    This is a general function that plots a graph of a set of data given an 
    input for the type of graph. In the future perhaps expand to take an array
    of objects as the input as opposed to file I/O on data.tsv
*/

function draw(chartType, userConfig, data) {

    console.log("target area: " + userConfig.targetArea);

    // delete old svg so graphs aren't cluttered
    d3.select("#" + userConfig.targetArea).html("");


    var config = {
        margin: {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        },
        colors: ["#0B609C", "#C64927", "#128F64", "#BE6293", "#DE8A34"],
        targetArea: "draw1"
    }

    config.dimension = {
            width: 640 - config.margin.left - config.margin.right,
            height: 500 - config.margin.top - config.margin.bottom
    }
    
    // override default configurations with user defined ones
    for (i in userConfig) {
        if (i != undefined) {
            config[i] = userConfig[i];
        }
    }
    
    // general functions depending on graph rendered
    d3.tsv("data.tsv", function(error, data) {
        if (chartType == "plain") {
            plain(data, config);
        } else if (chartType == "stack") {
            stack(data, config);
        } else if (chartType == "layer") {
            layer(data, config);
        } else if (chartType == "group") {
            group(data, config);
        } else if (chartType == "pie") {
            pie(data, config);
        } else {
            alert("Invalid chart type");
        }
    });
}
