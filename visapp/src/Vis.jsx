import {useRef, useEffect, useState} from 'react'
import {select, scaleLinear, axisBottom, axisLeft, axisRight} from 'd3'

import data from './test_data.json'; 
import data2 from './test_data2.json'; 


const Settings = {
    bar_width: 20,
    bar_size: 0.96,
    border: 80,
    y_max: 8
}


function Vis(){

    const [svgWidth, setSvgWidth] = useState(0);
    const svgRef = useRef();

    // update on rescale
    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                setSvgWidth(entry.contentRect.width);
            }
        });
        if (svgRef.current) {
            resizeObserver.observe(svgRef.current);
        }
        return () => {
            if (svgRef.current) {
                resizeObserver.unobserve(svgRef.current);
            }
        };
    }, []);


    useEffect(()=>{
        const svg = select(svgRef.current);

        const svgHeight_c = svgRef.current.clientHeight;

        const bar_window_size = {width: svgWidth - Settings.border * 2, height: svgHeight_c - Settings.border * 2}
        const bar_width = bar_window_size.width / data.length;
        const y_scale = scaleLinear([0, Settings.y_max],[0, bar_window_size.height]);
        const reverse_y_scale = scaleLinear([0, Settings.y_max],[bar_window_size.height, 0]);

        const yAxis = axisRight(reverse_y_scale);

        // this one should be replaced with countries
        const xAxis = axisBottom(scaleLinear([1, data.length + 1],[0, bar_window_size.width ]));

        const gy = svg.selectAll(".y-axis").data([null]);

        gy.enter()
            .append("g")
                .attr("class", "y-axis")
                .attr("transform", `translate(${Settings.border - 25},${Settings.border})`)
            .merge(gy)
                .call(yAxis.tickSize(bar_window_size.width + 25))
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line")
                    .attr("stroke-opacity", 0.5)
                    .attr("stroke-dasharray", "2,2"))
                .call(g => g.select(".tick:first-of-type line")
                    .attr("stroke-opacity", 0.5)
                    .attr("stroke-dasharray", null))
                .call(g => g.selectAll(".tick text")
                    .attr("x", 4)
                    .attr("dy", -4));

        const gx = svg.selectAll(".x-axis").data([null]); 

        gx.enter()
    .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(${Settings.border},${Settings.border + bar_window_size.height + 5})`)
    .merge(gx)
        .call(xAxis.ticks(svgWidth > 600 ? data.length : data.length / 2))
        .call(g => g.select(".domain").remove())
        .selectAll(".tick")
        .each(function(d, i, nodes) {
            if (i === nodes.length - 1) { 
                select(this).remove(); 
            }
        });

        svg.selectAll('.first').data(data).join(
            enter => enter.append('rect').attr('class', 'first'),
            update => update.attr('class', 'first'),
            exit => exit.remove()
        ).attr('width', () => { return (bar_window_size.width / data.length) * Settings.bar_size})
        .attr('height', function(d) { return y_scale(d); })
        .attr("x", function(d, i) { return (bar_window_size.width / data.length) * i + Settings.border})
        .attr("y", (d) => {return y_scale(Settings.y_max - d) + Settings.border });

    }, [svgWidth]);

    return (
        <div className="VisContainer">
            <svg className="SvgBarGraph" ref={svgRef}></svg>     
            <div className='SideBar'></div>       
        </div>
    );
}
export default Vis;