function change() {
    var i = this.options[this.selectedIndex].value;
    statusBar("#barchart", dataset[i].value, dataset[i].history);
}

function serviceDropDown(node) {

    d3.select(node).append("select")
        .on("change", change)
    .selectAll("option").data(dataset).enter().append("option")
        .attr("value", function(d,i){ return i; }) /* Optional */
        .text(function(d){ return d.value; });

}


function statusBar(node, title, data) {

    //var data = [-15, -20, -22, -18, 2, 6, -26, -18, 5];

    var margin = {top: 30, right: 10, bottom: 10, left: 30},
        width = 520 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    var y0 = Math.max(Math.abs(d3.min(data)), Math.abs(d3.max(data)));

    var y = d3.scale.linear()
        .domain([-y0, y0])
        .range([height,0])
        .nice();

    var x = d3.scale.ordinal()
        .domain(d3.range(data.length))
        .rangeRoundBands([0, width], .2);

    var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(10)
        .orient("left");

    var svg = d3.select(node).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", function(d) { return d < 0 ? "bar negative" : "bar positive"; })
        .attr("y", function(d) { return y(Math.max(0, d)); })
        .attr("x", function(d, i) { return x(i); })
        .attr("height", function(d) { return Math.abs(y(d) - y(0)); })
        .attr("width", x.rangeBand());

    svg.append("g")
        .attr("class", "x axis")
        .call(yAxis);

    svg.append("g")
        .attr("class", "y axis")
      .append("line")
        .attr("y1", y(0))
        .attr("y2", y(0))
        .attr("x1", 0)
        .attr("x2", width);


}