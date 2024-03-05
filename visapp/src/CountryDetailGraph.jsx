import {useRef, useEffect, useState} from 'react'
import { select, line, scaleLinear, axisBottom, axisLeft } from 'd3';

const Settings = {
    resolution: 1,
    height: 240,
    width: 400,
    border: 60,
    amount: 20,
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
        console.log(props.countryData);
        try {
            const data = props.countryData;
            start.current = Object.keys(props.countryData[0]).indexOf('1800');
            end.current = start.current + 223;
            console.log(start.current, " --- ", end.current)
        } catch (error) {
            console.error("Error loading data:", error.message);
        }
    }, [props.countryData]);

    useEffect( () => {
        console.log("selected country change");
        console.log(Object.values(props.selectedCountry));
        console.log(start.current, " - ", end.current);
        const this_country_history_data = Object.values(props.selectedCountry).slice(start.current, end.current).slice(-Settings.amount).map(Number)
        console.log(this_country_history_data);
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

        svg.selectAll(".line")
        .data([this_country_history_data]) // Wrap the data in an array so it's treated as a single entity
        .join(
            enter => enter.append("path")
            .attr("class", "line")
            .attr("d", myLine)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 3),
            update => update.call(update => update.transition() // Start a transition for a smooth update
            .attr("d", myLine) // Update the line path
            ),
            exit => exit.remove()
        );

    }, [props.selectedCountry]);
    

  return (
    <div className='CountryDetailGraph'>
        <svg ref={svgRef} width={Settings.width} height={Settings.height}>
            <g className='x-axis' />
            <g className='y-axis' />
        </svg>
    </div>
  )
}

export default CountryDetailGraph;
