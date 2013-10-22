function statusPanel(node) { 

var w = 500;
var h = 500;
var circleRadius = 14
var verticalStep = 3 * circleRadius
var verticalOffset = 25

var svg = d3.select(node)
            .append("svg")
            .attr("width", w)  
            .attr("height", h); 

svg.selectAll("circle1")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", 40)
    .attr("cy", function(d, i) {
            return (i * verticalStep) + verticalOffset;
       	})
    .attr("r", circleRadius)
    .attr("fill", function(d) {
    	if (d.serverstatus == 0) return "green"
        else return "red";
    	}); 


svg.selectAll("circle2")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", 80)
    .attr("cy", function(d, i) {
            return (i * verticalStep) + verticalOffset;
        })
    .attr("r", circleRadius)
    .attr("fill", function(d) {
	if (d.urlstatus == 0) return "green"
        else return "red";
	}); 

svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .attr("x", 110)
    .attr("y", function (d, i) {return (i *  verticalStep) + verticalOffset;})
    .attr("dy", ".35em") 
    .text(function(d) { return d.server + " - " + d.url; })
    .style("color","#DE3378");

}
