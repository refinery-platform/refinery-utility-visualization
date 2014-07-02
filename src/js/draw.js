/**
 *  Invokes the appropriate chart type and and draws it in a given drawspace.
 *  Clears the draw target as well as removes border "stroke" of text in that drawspace
 *  @param {string} chartType - "simple", "group", "layer", or "stack"
 *  @param {object} config - { height: number, width: number, drawTarget: string, orientation: string }
 *  @param {object} data - { items: Array[string], categories: Array[string], matrix: Array[Array[number]]}
 */

function draw(chartType, config, data) {
    var i, j, tmp;

    // delete old svg
    d3.select("#" + config.drawTarget).html("");

    // check if data contains negative values
    var hasNegative = false;
    data.matrix.map(function(d) { 
        d.map(function(d) {
            if (d < 0) {
                alert("Error: data set contains negative values");
                hasNegative = true;
            }
        }); 
    });

    if (hasNegative) return;

    // make deep copies for new ones
    var nData = jQuery.extend(true, {}, data);
    var nConfig = jQuery.extend(true, {}, config);
    var nBarEvents = jQuery.extend(true, {}, barEvents);
    var nLabelEvents = jQuery.extend(true, {}, labelEvents);

    // sort nData given config flags
    // transform data into data structure
    var res = [];
    for (i = 0; i < data.items.length; i++) {
        res.push({id: data.items[i], value: data.matrix[i].sum() });
    }

    // I am so sorry but it was easy to rationalize about
    for (i = 0; i < res.length; i++) {
        for (j = 0; j < res.length - i - 1; j++) {
            if ((config.sort === "sum")? (res[j].value < res[j+1].value) : 
                    (config.sort === "label")? (res[j].id > res[j+1].id) : false) {
                swap(res, j , j + 1);
                swap(nData.items, j, j + 1);
                swap(nData.matrix, j, j + 1);
                swap(nConfig.color, j, j + 1);
            }
        }
    }

    if (chartType === "group") {
        group(nData, nConfig, nBarEvents, nLabelEvents);
    } else if (chartType === "layer") {
        layer(nData, nConfig, nBarEvents, nLabelEvents);
    } else if (chartType === "simple") {
        simpleplain(nData, nConfig, nBarEvents, nLabelEvents);
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

/**
 *  Wrapper object. Return statement in src/js/wrap/footer.foo
 */
var util = {
  draw: draw
};