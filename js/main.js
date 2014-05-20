function draw(chartType, config, data) {

    // delete old svg so graphs aren't cluttered
    d3.select("#" + config.drawTarget).html("");

    // make deep copies for protection against mutation
    var nData = jQuery.extend(true, {}, data);
    var nConfig = jQuery.extend(true, {}, config);
    var nEvents = jQuery.extend(true, {}, events);

    console.log(nData)
    console.log(nConfig)
    console.log(nEvents)

    // general functions depending on graph rendered
    if (chartType === "group") {
        group(nData, nConfig, nEvents);
    } else if (chartType === "layer") {
    	layer(nData, nConfig, nEvents);
	} else if (chartType === "simple") {
        simplePlain(nData, nConfig, nEvents);
    } else if (chartType === "stack") {
        stack(nData, nConfig, nEvents);
    } else {
        alert("Invalid chart type");
    }
}