function itemCallback(nData, d, i) {
    console.log("called itemCallback with nData, d, i: ");
    console.log(nData);
    console.log(d);
    console.log(i);
}


function categoryCallback(nData, d, i) {
    console.log("called categoryCallback with nData, d, i: ");
    console.log(nData);
    console.log(d);
    console.log(i);
}

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
        colors: d3.scale.category10().range(),
        hoverOpacity: 0.6,
        callbacks: { item: itemCallback, category: categoryCallback }
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
    } else if (chartType == "multiplain") {
        multiplain(modifiedData, config);
    } else if (chartType == "generic") {
        genericTest(modifiedData, config);
    } else {
        alert("Invalid chart type");
    }
    
}