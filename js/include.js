// some stuff that makes life easier
Array.prototype.max = function() {
    var max = 0;
    var i = this.length;
    while (i--) {
        if (max < this[i])
            max = this[i];
    }
    return max;
}

// super optimized sum function found on StackOverflow!
Array.prototype.sum = function() {
    var total = 0;
    var i = this.length;
    while (i--) {
        total += this[i];
    }
    return total;
}

var tooltip = d3.select("body")
    .append("div")
        .attr("class", "refinery-utility-tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("text-align", "center")
        .attr("width", "100px")
        .style("background-color", "#000")
        .style("opacity", "0.8")
        .style("color", "#fff")
        .style("font-weight", "normal")
        .style("font-size", "11.9px")
        .style("border-radius", "3px")
        .style("padding", "1px 4px 1px 4px");

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
