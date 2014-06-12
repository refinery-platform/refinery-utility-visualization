// some stuff that makes life easier
Array.prototype.max = function() {
    var max = 0;
    var i = this.length;
    while (i--) {
        if (max < this[i])
            max = this[i];
    }
    return max;
};

// super optimized sum function found on StackOverflow!
Array.prototype.sum = function() {
    var total = 0;
    var i = this.length;
    while (i--) {
        total += this[i];
    }
    return total;
};

/**
 * Defines a universal barTooltip for the visualization tool with some inline CSS 
 * @type {object}
 */
var barTooltip = d3.select("body")
    .append("div")
        .attr("class", "refinery-utility-barTooltip")
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


var labelTooltip = d3.select("body")
    .append("div")
        .attr("class", "refinery-utility-labelTooltip")
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

/**
 * Mouse events for the cursor as it goes across various bars
 * @type {object}
 */
var events = {
    onMouseMove: function(data, g, events) {
        if (events.barTooltipFlag) {
            events.barTooltip
                .html(data.id + "<br>" + data.value)
                .style("opacity", 0.9)
                .style("top", (d3.event.pageY - 10) + "px")
                .style("left", (d3.event.pageX + 10) + "px");
        }
    },
    onMouseOver: function(data, g, events) {
        events.barTooltipFlag = true;
        d3.select(g.parentNode).selectAll(".bar")
                .attr("opacity", 0.6);
        d3.select(g).attr("opacity", 1);
    },
    onMouseOut: function(data, g, events) {
        events.barTooltipFlag = false;
        d3.select(g.parentNode).selectAll(".bar")
                .attr("opacity", 1);
        events.barTooltip.style("opacity", 0);
    },
    onClick: function(data, g, events) {
        console.log("clicky action going on");
    },
    barTooltip: barTooltip,
    barTooltipFlag: false
};

var labelEvents = {
    onMouseMove: function(data, g, events) {
        console.log("mouse moving");
        if (labelEvents.labelTooltipFlag) {
            console.log(labelEvents);
            console.log(labelTooltip);
            
            labelTooltip
                .html(data)
                .style("opacity", 0.9)
                .style("top", (d3.event.pageY - 10) + "px")
                .style("left", (d3.event.pageX + 10) + "px");

        }
    },
    onMouseOver: function(data, g, events) {
        console.log("mouse overing");
        labelEvents.labelTooltipFlag = true;
    },
    onMouseOut: function(data, g, events) {
        console.log("mouse outing");
        labelEvents.labelTooltip = false;
        labelTooltip.style("opacity", 0);
    },
    onClick: function(data, g, events) {
        console.log("CLICKY THING OGIN GOIN TOIJEOIFDJ");
        console.log(data);
        console.log(g);
    },
    lableTooltip: labelTooltip,
    labelTooltipFlag: false
};

console.log(labelTooltip);

function getTextLength(text) {
    d3.selectAll("#test").remove();
    var test = d3.select("body").append("svg")
        .attr("id", "test")
        .attr("width", 0).attr("height", 0)
        .selectAll("text")
        .data([1]).enter().append("text")
            .text(text);

    return test[0][0].getBBox().width;
}

function trim(text, maxLength) {

    if (getTextLength(text) <= maxLength) {
        // no trimming needed!
        return text;
    }

    // loop until no need to cut down no more
    for (var i = 0; i < (text.length / 2); i++) {
        var tmpText = text.substring(0, text.length / 2 - i) + ".." + text.substring(text.length / 2 + i, text.length);

        if (getTextLength(tmpText) <= maxLength) {
            return tmpText;
        }
    }
}
