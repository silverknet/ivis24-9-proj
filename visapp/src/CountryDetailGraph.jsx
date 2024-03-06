import {useRef, useEffect, useState} from 'react'
import { select, line, scaleLinear, axisBottom, axisLeft, pointer} from 'd3';

const Settings = {
    resolution: 1,
    height: 240,
    width: 400,
    border: 60,
    amount: 30,
    max: 9,
    current_year: 2022
}
const mockdata = [3,4,5,2,5,6,7,2,6,7,5,6,7,8];

function CountryDetailGraph(props) {
    const svgRef = useRef();
   
    /*
    when converting the country data to to a list, the history data will go from 'start' (1800) (see below) to start + 222 (2022);
    */
    const start = useRef(0);
    const end = useRef(0);

    useEffect(() => {
        try {
            const data = props.countryData;
            start.current = Object.keys(props.countryData[0]).indexOf('1992');
            end.current = start.current + 31;
        } catch (error) {
        }
    }, [props.countryData]);

    useEffect( () => {
        const this_country_history_data = Object.values(props.selectedCountry).slice(start.current, end.current).slice(-Settings.amount).map(Number)
        const svg = select(svgRef.current);

        const xScale = scaleLinear()
        .domain([0, this_country_history_data.length - 1])
        .range([0 + Settings.border, Settings.width - Settings.border]);

        const min_value = Math.min(...this_country_history_data) - 1;
        const max_value = Math.max(...this_country_history_data) + 1;
        const yScale = scaleLinear()
        .domain([min_value, max_value])
        .range([Settings.height - Settings.border, 0 + Settings.border]);

        const x_middleTick = (this_country_history_data.length - 1) / 2;

        
        // X-axis ***
        let xAxisGroup = svg.selectAll('.x-axis').data([0]);
        xAxisGroup.enter()
            .append("g")
            .attr('class', 'x-axis')
            .merge(xAxisGroup)
            .attr("transform", `translate(0,${Settings.height - Settings.border})`)
            .call(axisBottom(xScale)
            .tickValues([0, x_middleTick, this_country_history_data.length - 1]) 
            .tickFormat((d, i) => i === 0 ? `${Settings.current_year - Settings.amount}` : i === 1 ? `${Settings.current_year - Math.floor(Settings.amount/2)}` : `${Settings.current_year}`)  // Optional: Custom tick labels
        ).selectAll('text')
        .attr('dy', '15');

        //x-axis label
        let xAxisLabel = xAxisGroup.selectAll(".x-axis-label").data([0]);
        xAxisLabel.enter()
            .append("text")
            .attr("class", "x-axis-label")
            .merge(xAxisLabel) 
            .attr("x", Settings.width / 2)
            .attr("y", 30)
            .attr("fill", "currentColor")
            .style("text-anchor", "middle")
            .text("Year");

        xAxisLabel.exit().remove();

        // y-axis ***
        const custom_ticks ={
            first: min_value,
            second: min_value + (max_value - min_value)/3,
            third: min_value + (2*(max_value - min_value))/3,
            fourth: max_value
        }

        let yAxisGroup = svg.selectAll('.y-axis').data([0]);
        yAxisGroup.enter()
            .append("g")
            .attr('class', 'y-axis')
            .merge(yAxisGroup)
            .attr("transform", `translate(${Settings.border},0)`)
            .call(axisLeft(yScale)
                .tickValues([custom_ticks.first, custom_ticks.second, custom_ticks.third, custom_ticks.fourth])
                .tickFormat((d, i) => {
                    switch (i) { 
                        case 0: return `${Math.round(custom_ticks.first*100)/100}`;
                        case 1: return `${Math.round(custom_ticks.second*100)/100}`;
                        case 2: return `${Math.round(custom_ticks.third*100)/100}`;
                        case 3: return `${Math.round(custom_ticks.fourth*100)/100}`; 
                        default:
                          return "Undefined"; 
                    }
                }) 
            ).selectAll('text')
            .attr('dx', '-5');
            
        // y-axis label
        let yAxisLabel = yAxisGroup.selectAll(".y-axis-label").data([0]);
        yAxisLabel.enter()
            .append("text")
            .attr("class", "y-axis-label")
            .merge(yAxisLabel)
            .attr("transform", `translate(${-18}, ${Settings.border - 20})`)
            .attr("fill", "currentColor")
            .style("text-anchor", "middle")
            .text("Co2 (Tons)");
            
        yAxisLabel.exit().remove();

        const myLine = line()
        .x((_, index) => xScale(index))
        .y(value => yScale(value));

        const tooltip = select("#tooltip")
        const tooltipCircle = svg
            .append("circle")
            .attr("r", 3)
            .attr("fill", "#fdff80")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .style("opacity", 0)
            .style('pointer-events', 'none');

        svg.selectAll(".line")
        .data([this_country_history_data]) // Wrap the data in an array so it's treated as a single entity
        .join(
            enter => enter.append("path")
            .attr("class", "line")
            .attr("d", myLine)
            .attr("fill", "none")
            .attr("stroke", "#82BD8C")
            .attr("stroke-width", 3),
            update => update.call(update => update.transition() // Start a transition for a smooth update
            .attr("d", myLine) // Update the line path
            ),
            exit => exit.remove()
        );

        svg
        .on('touchmouse mousemove', function(event){
            const mousePos = pointer(event, this)
            //console.log(mousePos)
            const hover_year = Math.floor(xScale.invert(mousePos[0])+1)
            const hover_value = this_country_history_data[hover_year];
            //console.log(year);
            //console.log(year+Settings.current_year-Settings.amount + " " + this_country_history_data[year])
            
            if(hover_value != undefined && hover_year+Settings.current_year-Settings.amount < 2022){
                tooltipCircle.style('opacity', 1).attr('cx',xScale(hover_year)).attr('cy', yScale(hover_value))
                tooltip.select(".CO2Val").text(hover_value + " Tons");
                tooltip.select(".historyYear").text("Year "+ (hover_year+Settings.current_year-Settings.amount))
                tooltip.style("display", "block").style("top", `${yScale(hover_value) + 255 }px`).style("left", `${xScale(hover_year) + 600}px`);
            }
            
            
          })
        .on('mouseleave', function(event){
            tooltipCircle.style("opacity", 0);
            tooltip.style("display", "none");
        })

    }, [props.selectedCountry]);
    
    

    

  return (
    <div className='CountryDetailGraph'>
        <svg ref={svgRef} width={Settings.width} height={Settings.height}>
            <g className='x-axis' />
            <g className='y-axis' />
        </svg>
        <div id="tooltip">
            <div className='CO2Val'></div>
            <div className='historyYear'></div>
        </div>
    </div>
  )
}

export default CountryDetailGraph;
