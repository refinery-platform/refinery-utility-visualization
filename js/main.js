/*
    This is a general function that plots a graph of a set of data given an 
    input for the type of graph. In the future perhaps expand to take an array
    of objects as the input as opposed to file I/O on data.tsv
*/

function draw(chartType, userConfig, data) {

    // perform deep copy to preserve original data objects
    var modifiedData = jQuery.extend(true, {}, data);

    modifiedData.nData = new Array();
    for (var i = 0; i < data.items.length; i++) {
        modifiedData.nData.push({});
        modifiedData.nData[i]["item"] = data.items[i];
        for (var j = 0; j < data.categories.length; j++) {
            modifiedData.nData[i][data.categories[j]] = data.matrix[i][j];
        }
    }

    // delete old svg so graphs aren't cluttered
    d3.select("#" + userConfig.targetArea).html("");

    var config = {
        margin: {
            top: 20,
            right: 20,
            bottom: 30,
            left: 100
        },
        colors: ["#0B609C", "#C64927", "#128F64", "#BE6293", "#DE8A34", "gray"],
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

    if (chartType == "plain") {
        plain(modifiedData, config);
    } else if (chartType == "stack") {
        stack(modifiedData, config);
    } else if (chartType == "layer") {
        layer(modifiedData, config);
    } else if (chartType == "group") {
        group(modifiedData, config);
    } else if (chartType == "pie") {
        pie(modifiedData, config);
    } else {
        alert("Invalid chart type");
    }
    
}
