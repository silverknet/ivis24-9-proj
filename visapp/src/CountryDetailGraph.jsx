import {useRef, useEffect, useState} from 'react'
import { select, line, scaleLinear, axisBottom, axisLeft } from 'd3';

const Settings = {
    resolution: 1,
    height: 180,
    width: 320,
    border: 30,
    amount: 10,
    max: 9
}
const mockdata = [3,4,5,2,5,6,7,2,6,7,5,6,7,8];

function CountryDetailGraph(props) {
    const svgRef = useRef();
    let start = 0;
    let end = 0;
    /*
    when converting the country data to to a list, the history data will go from 'start' (1800) (see below) to start + 222 (2022);
    */
    useEffect( () => {
        console.log(props.countryData);
        try{
            const data = props.countryData;
            start = Object.keys(props.countryData[0]).indexOf('1800');  
            end = start + 223         
        }catch(error){
            console.error("Error loading data:", error.message);
        }
    },[props.countryData])

    useEffect( () => {
        console.log("selected country change");
        const this_country_history_data = Object.values(props.selectedCountry).slice(start, end).slice(-Settings.amount).map(Number)
        console.log(this_country_history_data);

        const svg = select(svgRef.current);

        const xScale = scaleLinear()
        .domain([0, this_country_history_data.length - 1])
        .range([0 + Settings.border, Settings.width - Settings.border]);

        const yScale = scaleLinear()
        .domain([Math.min(...this_country_history_data) - 1, Math.max(...this_country_history_data) + 1])
        .range([Settings.height - Settings.border, 0 + Settings.border]);

        let xAxisGroup = svg.selectAll('.x-axis').data([0]);
        xAxisGroup.enter()
            .append("g")
            .attr('class', 'x-axis')
            .merge(xAxisGroup)
            .attr("transform", `translate(0,${Settings.height - Settings.border})`)
            .call(axisBottom(xScale))
            .selectAll('text')
            .style('fill', 'red');

        let yAxisGroup = svg.selectAll('.y-axis').data([0]);
        yAxisGroup.enter()
            .append("g")
            .attr('class', 'y-axis')
            .merge(yAxisGroup)
            .attr("transform", `translate(${Settings.border},0)`)
            .call(axisLeft(yScale).ticks(4))
            .selectAll('text')
            .style('fill', 'red');

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
            .attr("stroke", "blue"),
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
