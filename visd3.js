window.onload = function () {
    var svgCanvas = d3.select("body")
        .append("svg")
        .attr("width", 1000)
        .attr("height", 540)
        .attr("class", "svgCanvas");
   

    var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0.9);
    
    var final_data 
    var p=0
    var radius_save
    var count2 = 0
    var count = 0
    var f =[]
    var x1_value = 0
    
    //Reading data using .json and saving in variable final_data
    d3.json("data.json", function (data) {
        final_data = data
        
        //calculating radius of each circle based on sum of amounts
        var radius_value = 0
        radius_value = function(d) { radius_value = 0
                final_data.links.forEach(function(e) {
                    
                    if (d.id == e.node01 || d.id == e.node02) { radius_value = radius_value + e.amount;}
                    
                    
                })
                f = radius_value
                return radius_value/50
            }
        
    
        //scaling values 
        var minValue = Infinity;
        var maxValue = -1;
        final_data.links.forEach(function(thisD) {
            var thisValue = thisD.amount;
            minValue = Math.min(minValue, thisValue);
            maxValue = Math.max(maxValue, thisValue);            
        });
        
        var value2range = d3.scaleLinear()
            .domain([minValue,maxValue])
            .range([0.1,6]);
        
        //creating lines on svgcanvas    
       svgCanvas.selectAll("line")
           .data(final_data.links)
           .enter()
         .append("line")
         .attr("x1",  function(d) {
           return final_data.nodes.find(function(e) {
             return e.id == d.node01
           }).x;
         
         })
         .attr("x2",  function(d) {
           return final_data.nodes.find(function(e) {
             return e.id == d.node02
           }).x;
         
         })
         .attr("y1", function(d) {
           return final_data.nodes.find(function(e) {
             return e.id == d.node01
           }).y;
         
         })
         .attr("y2", function(d) {
           return final_data.nodes.find(function(e) {
             return e.id == d.node02
         }).y;
         
         })
         .attr("stroke","blue")
         .style("stroke-width", function(d) {return value2range(d.amount); })
        
          .style("fill", "none")
          // .attr("d", line)
         // .attr("marker-end", "url(#triangle)")
        ;
                
        //creating cirles on svgcanvas
        svgCanvas.selectAll("circle")
            .data(final_data.nodes)
            .enter()
            .append("circle")
            .attr("cx", function(thisElement,index) {
                    return thisElement.x;
            
            
        })
            .attr("cy", function(thisElement,index) {
                    return thisElement.y;
            })
            
            
        
        
        
            .attr("r", radius_value)
        
                
            .attr("fill","red")
         
        //adding properties of higlighting lines and tooltips on circle mouseover
        .on("mouseover", function (d, index){
          
             svgCanvas.selectAll("circle")
                .attr("opacity",0.2)
               d3.select(this).attr("opacity",1)
                svgCanvas.selectAll("line")
                .attr("opacity", function (line_d) { return line_d.node01 == d.id || line_d.node02 == d.id  ? 1 : 0.05;   })
            
           
           //calculating connected nodes
             count = 0
           
            final_data.links.forEach(function (c) { 
                 
                 if (c.node01 == d.id || c.node02 == d.id)  
                 {count = count + 1}
                // return count;
             }) 
            
            
            
            div.transition()
                            .duration(200)
                            .style("opacity", 1);
                        div.html("Site Name : " + d.id + "<br> Total amount = " + Math.round(d3.select(this).attr("r")*50) +  "<br> Total Connected Nodes : " + count)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px"); 
                
            }
               )
            .on("mouseout", function(thisElement, index) {
                svgCanvas.selectAll("circle").attr("opacity",1)
                svgCanvas.selectAll("line").attr("opacity",1);
                div.transition()
          .duration(500)
          .style("opacity", 0);
            })
           
        
        ;
        
        
    });
    
    
}