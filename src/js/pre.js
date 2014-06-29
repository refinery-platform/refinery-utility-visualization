/**
 *  Max function for numerical array found on Stack Overflow
 */
Array.prototype.max = function() {
    var max = 0;
    var i = this.length;
    while (i--) {
        if (max < this[i])
            max = this[i];
    }
    return max;
};

/**
 *  Super optimized numerical sum function from Stack Overflow
 */
Array.prototype.sum = function() {
    var total = 0;
    var i = this.length;
    while (i--) {
        total += this[i];
    }
    return total;
};

/**
 *  Defines a universal bar tooltip
 *  @type {object}
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

/**
 *  Defines a universal label tooltip
 *  @type {object}
 */
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
var barEvents = {
    onMouseMove: function(data, g, barEvents, userDefined) {
        if (barEvents.barTooltipFlag) {
            barEvents.barTooltip
                .html(data.id + "<br>" + data.value)
                .style("opacity", 0.9)
                .style("top", (d3.event.pageY - 10) + "px")
                .style("left", (d3.event.pageX + 10) + "px");
        }

        if (userDefined && userDefined.onMouseMove) {
            userDefined.onMouseMove();
        }
    },
    onMouseOver: function(data, g, barEvents, userDefined) {
        barEvents.barTooltipFlag = true;
        d3.select(g.parentNode).selectAll(".bar")
                .attr("opacity", 0.6);
        d3.select(g).attr("opacity", 1);

        if (userDefined && userDefined.onMouseOver) {
            userDefined.onMouseOver();
        }
    },
    onMouseOut: function(data, g, barEvents, userDefined) {
        barEvents.barTooltipFlag = false;
        d3.select(g.parentNode).selectAll(".bar")
                .attr("opacity", 1);
        barEvents.barTooltip.style("opacity", 0);

        if (userDefined && userDefined.onMouseOut) {
            userDefined.onMouseOut();
        }
    },
    onClick: function(data, g, barEvents, userDefined) {
        console.log("clicky bar action going on");

        if (userDefined && userDefined.onClick) {
            userDefined.onClick();
        }
    },
    barTooltip: barTooltip,
    barTooltipFlag: false
};

/**
 *  Mouse events for the cursor as it goes across axes labels and others
 *  @type {object}
 */
var labelEvents = {
    onMouseMove: function(data, g, labelEvents, userDefined) {
        if (labelEvents.labelTooltipFlag) {            
            labelTooltip
                .html(data)
                .style("opacity", 0.9)
                .style("top", (d3.event.pageY - 10) + "px")
                .style("left", (d3.event.pageX + 10) + "px");
        }

        if (userDefined && userDefined.onMouseMove) {
            userDefined.onMouseMove();
        }
    },
    onMouseOver: function(data, g, labelEvents, userDefined) {
        labelEvents.labelTooltipFlag = true;

        if (userDefined && userDefined.onMouseOver) {
            userDefined.onMouseOver();
        }
    },
    onMouseOut: function(data, g, labelEvents, userDefined) {
        labelEvents.labelTooltip = false;
        labelTooltip.style("opacity", 0);

        if (userDefined && userDefined.onMouseOut) {
            userDefined.onMouseOut();
        }
    },
    onClick: function(data, g, labelEvents, userDefined) {
        console.log("clicky label action going on");

        if (userDefined && userDefined.onClick) {
            userDefined.onClick();
        }
    },
    lableTooltip: labelTooltip,
    labelTooltipFlag: false
};

/**
 *  Make a 0x0 px test space for get getTextLength / Height functions
 *  @param {string} - Make SVG test space with this string
 */
function makeTestTextSpace(text) {
    d3.selectAll("#test").remove();
    var test = d3.select("body").append("svg")
        .attr("id", "test")
        .attr("width", 0).attr("height", 0)
        .selectAll("text")
        .data([1]).enter().append("text")
            .text(text);

    return test[0][0].getBBox();
}


/**
 *  Gets pixel length of string
 *  @param {string} - The string whose pixel length you want to find
 */
function getTextLength(text) {
    return makeTestTextSpace(text).width;
}


/**
 *  Get pixel height of string
 *  @param {string} - The string whose pixel height you want to find
 */
function getTextHeight(text) {
    return makeTestTextSpace(text).height;
}

/**
 *  Trims a string given a maximum pixel length if the current string exceeds the max pixel length
 *  @param {string} - The string that you want to trim
 *  @param {number} - Upper bound of pixel length the resulting string should have
 */
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

