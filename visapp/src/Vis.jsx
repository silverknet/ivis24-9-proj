import {useRef, useEffect, useState} from 'react'
import {select, scaleLinear, axisBottom, axisLeft, axisRight, csv} from 'd3'

import data from './test_data.json'; 
import data2 from './test_data2.json'; 

import SideBarTop from './SideBarTop';
import SideBarBottom from './SideBarBottom';
import SideBarMiddle from './SideBarMiddle';


const Settings = {
    bar_size: 0.80, // bar fill percentage
    border: 50,
    y_max: 50
}


function Vis(){

    const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
    const [countryData, setCountryData] = useState([]); // State to store the loaded CSV data
    const [selectedCountry, setSelectedCountry] = useState({}); 
    const [policyState, setPolicyState] = useState({
        meat: false,
        flight: false,
        electric: false
    });
    const [rightDisplay, setRightDisplay] = useState(0);

    const svgRef = useRef();

    // Load CSV data
    useEffect(() => {
        csv('/data/merged_data.csv').then(data2 => {
            const filteredAndSorted = data2
            .filter(d => Number(d['2022']) > 3) 
            .sort((a, b) => Number(a['2022']) - Number(b['2022'])); 
        setCountryData(filteredAndSorted); 
        }).catch(error => console.error('Error loading the CSV file:', error));
    }, []); 

    
      
    // useEffect(() => {
    //     console.log(policyState);
    // },[policyState]);

    // update on rescale
    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                setSvgSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
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

        const bar_window_size = {width: svgSize.width - Settings.border * 2, height: svgSize.height - Settings.border * 2}
        const bar_width = bar_window_size.width / countryData.length;
        const y_scale = scaleLinear([0, Settings.y_max],[0, bar_window_size.height]);
        const reverse_y_scale = scaleLinear([0, Settings.y_max],[bar_window_size.height, 0]);

        const yAxis = axisRight(reverse_y_scale);

        // this one should be replaced with countries
        const xAxis = axisBottom(scaleLinear([1, countryData.length + 1],[0, bar_window_size.width ]));

        const gy = svg.selectAll(".y-axis").data([null]);

        gy.enter()
            .append("g")
                .attr("class", "y-axis")
            .merge(gy)
                .attr("transform", `translate(${Settings.border - 25},${Settings.border})`)
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
        .merge(gx)
            .attr("transform", `translate(${Settings.border},${Settings.border + bar_window_size.height + 5})`)
            .call(xAxis.ticks(svgSize.width > 600 ? countryData.length : countryData.length / 2))
            .call(g => g.select(".domain").remove())
            .selectAll(".tick")
            .each(function(d, i, nodes) {
                if (i === nodes.length - 1) { 
                    select(this).remove(); 
                }
            });

        // svg.selectAll('.first').data(data).join(
        //     enter => enter.append('rect').attr('class', 'first'),
        //     update => update.attr('class', 'first'),
        //     exit => exit.remove()
        // ).attr('width', () => { return Math.max(0, (bar_window_size.width / data.length) * Settings.bar_size)})
        // .attr('height', function(d) { return Math.max(0, y_scale(d)); })
        // .attr("x", function(d, i) { return (bar_window_size.width / data.length) * i + Settings.border})
        // .attr("y", (d) => {return y_scale(Settings.y_max - d) + Settings.border });

        svg.selectAll('.first').data(countryData).join(
            enter => enter.append('rect').attr('class', 'first'),
            update => update.attr('class', 'first'),
            exit => exit.remove()
        ).attr('width', () => { return Math.max(0, (bar_window_size.width / countryData.length) * Settings.bar_size)})
        .attr('height', function(d) { return Math.max(0, y_scale(d['2022'])); })
        .attr("x", function(d, i) { return (bar_window_size.width / countryData.length) * i + Settings.border})
        .attr("y", (d) => {return y_scale(Settings.y_max - d['2022']) + Settings.border })
        .on('click', (p_e,d) => {
            setSelectedCountry(d);
        });
        console.log(selectedCountry);

    }, [svgSize, rightDisplay, countryData, selectedCountry]);

    return (
        <div className="VisContainer">
            <svg className="SvgBarGraph" ref={svgRef}></svg>  
            <div className='SideBar'>  
                <div className='SelectBox' onClick={() => setRightDisplay(0)}>Pick & Choose</div>
                <div className={`Component SideBarTop ${rightDisplay === 0 ? "display" : "no-display"}`}><SideBarTop/></div>
                
                <div className='SelectBox' onClick={() => setRightDisplay(1)}>Country Overview</div>
                <div className={`Component SideBarMiddle ${rightDisplay === 1 ? "display" : "no-display"}`}><SideBarMiddle selectedCountry={selectedCountry}/></div>  {/* Corrected the condition to `rightDisplay === 1` for `SideBarMiddle` */}

                <div className='SelectBox' onClick={() => setRightDisplay(2)}>Consumption Bans</div>
                <div className={`Component SideBarBottom ${rightDisplay === 2 ? "display" : "no-display"}`}><SideBarBottom setPolicyState={setPolicyState} policyState={policyState}/></div>  {/* Corrected the class to `SideBarBottom` and condition to `rightDisplay === 2` for `SideBarBottom` */}
            </div>  
        </div>
    );
}
export default Vis;