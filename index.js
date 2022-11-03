let url="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
let req=new XMLHttpRequest();

let baseTemp,values;

let xscale,yscale;

let maxYear,minYear;

let width=1200;
let height=600;
let padding=60;

let xAxis,yAxis;

let canvas=d3.select("#canvas")
canvas.attr('width',width)
canvas.attr('height',height)  

function generateScales(){
    minYear=d3.min(values,(item)=>{
        return item['year'];
    });
    maxYear=d3.max(values,(item)=>{
        return item['year'];
    })
    xscale=d3.scaleLinear()
    .domain([minYear,maxYear+1])
    .range([padding,width-padding]);
    yscale=d3.scaleTime()
        .domain([new Date(0,0,0,0,0,0,0),new Date(0,12,0,0,0,0,0)])
        .range([padding,height-padding]);
}
function drawCells(){
    let tooltip=d3.select('#tooltip');
    canvas.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('class','cell')
        .attr('fill',(item)=>{
            variance=item['variance'];
            if(variance<=-1){
                return 'SteelBlue';
            }
            else if(variance<=0){
                return 'LightSteelBlue';
            }
            else if(variance<=1){
                return 'Orange';
            }
            else{
                return 'Red'
            }
        })
        .attr('data-year',(item)=>{
            return item['year']
        })
        .attr('data-month',(item)=>{
            return item['month']-1
        })
        .attr('data-temp',(item)=>{
            return baseTemp+(item['variance'])
        })
        .attr('height',(height-2*padding)/12)
        .attr('y',(item)=>{
            return yscale(new Date(0,item['month']-1,0,0,0,0,0) )
        })
        .attr('width',(item)=>{
            let number_of_years=maxYear-minYear;
            return (width-2*padding)/number_of_years
        })
        .attr('x',(item)=>{
            return xscale(item['year']);
        })
        .on('mouseover', (a) => {
            item=a['path'][0]['__data__'];
            tooltip.transition().style('visibility', 'visible');
            let monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
            tooltip.text(item['year'] + ' ' + monthNames[item['month'] -1 ] + ' : ' + item['variance']);
            tooltip.attr('data-year', item['year'])
        })
        .on('mouseout', (item) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        });
        

}
function drawAxis(){

    xAxis=d3.axisBottom(xscale).tickFormat(d3.format('d'));
    canvas.append('g')
        .call(xAxis)
        .attr("id","x-axis")
        .attr('transform','translate(0,'+(height-padding)+')');
    yAxis=d3.axisLeft(yscale).tickFormat(d3.timeFormat('%B'));
    canvas.append('g')
        .call(yAxis)
        .attr("id","y-axis")
        .attr('transform','translate('+padding+',0)');

}
req.open("GET",url,true);
req.onload=()=>{
    let object=JSON.parse(req.responseText);
    baseTemp=object['baseTemperature'];
    values=object['monthlyVariance'];
    console.log(baseTemp);
    console.log(values);
    generateScales();
    drawCells();
    drawAxis();
}
req.send();
