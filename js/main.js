var tooltip = d3.select("body")
    .append("div")
    .attr("class", "refinery-utility-tooltip")
    .style("opacity", 0);
    
// give events some fancy functions
var events = {
    onMouseMove: function(data, g, events) {
        if (events.tooltipFlag) {
            events.tooltip
                .html(data.id + "<br>" + data.value)
                .style("opacity", 0.9)
                .style("top", (d3.event.pageY - 10) + "px")
                .style("left", (d3.event.pageX + 10) + "px");
        }
    },
    onMouseOver: function(data, g, events) {
        events.tooltipFlag = true;
        d3.select(g.parentNode).selectAll(".bar")
            .attr("opacity", 0.6);
        d3.select(g).attr("opacity", 1);
    },
    onMouseOut: function(data, g, events) {
        events.tooltipFlag = false;
        d3.select(g.parentNode).selectAll(".bar")
            .attr("opacity", 1);
        events.tooltip.style("opacity", 0);
    },
    onClick: function(data, g, events) {
        console.log("clicky action going on");
    },
    tooltip: tooltip,
    tooltipFlag: false
}

function draw(chartType, config, data) {

    // delete old svg so graphs aren't cluttered
    d3.select("#" + config.drawTarget).html("");

    // make deep copies for protection against mutation
    var nData = jQuery.extend(true, {}, data);
    var nConfig = jQuery.extend(true, {}, config);
    var nEvents = jQuery.extend(true, {}, events);

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