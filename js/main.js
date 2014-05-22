function draw(chartType, data, config) {

    // delete old svg
    d3.select("#" + config.drawTarget).html("");

    // make deep copies for new ones
    var nData = jQuery.extend(true, {}, data);
    var nConfig = jQuery.extend(true, {}, config);
    var nEvents = jQuery.extend(true, {}, events);

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

    // try to clean up
    d3.select("body").selectAll("text")
        .attr("font-family", "sans-serif")
        .attr("fill", "black")
        .attr("font-size", "14px")
}

var util = {
  draw: draw
}
