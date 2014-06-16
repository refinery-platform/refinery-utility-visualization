/**
 *  Invokes the appropriate chart type and and draws it in a given drawspace.
 *  Clears the draw target as well as removes border "stroke" of text in that drawspace
 *  @param {string} chartType - "simple", "group", "layer", or "stack"
 *  @param {object} config - { height: number, width: number, drawTarget: string, orientation: string }
 *  @param {object} data - { items: Array[string], categories: Array[string], matrix: Array[Array[number]]}
 */
function draw(chartType, config, data) {

    // delete old svg
    d3.select("#" + config.drawTarget).html("");

    // make deep copies for new ones
    var nData = jQuery.extend(true, {}, data);
    var nConfig = jQuery.extend(true, {}, config);
    var nBarEvents = jQuery.extend(true, {}, barEvents);
    var nLabelEvents = jQuery.extend(true, {}, labelEvents);

    if (chartType === "group") {
        group(nData, nConfig, nBarEvents, nLabelEvents);
    } else if (chartType === "layer") {
        layer(nData, nConfig, nBarEvents, nLabelEvents);
    } else if (chartType === "simple") {
        simplePlain(nData, nConfig, nBarEvents, nLabelEvents);
    } else if (chartType === "stack") {
        stack(nData, nConfig, nBarEvents, nLabelEvents);
    } else {
        alert("Invalid chart type");
    }

    d3.select("#" + config.drawTarget).selectAll("text")
        .attr("font-family", "times new roman")
        .attr("font-size", "14px")
        .attr("fill", "black")
        .attr("stroke", "none");
}

var util = {
  draw: draw
};