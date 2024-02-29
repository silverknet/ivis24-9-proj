import {useRef, useEffect, useState} from 'react'
import {select, scaleLinear, axisBottom, axisLeft, axisRight, csv, line, text} from 'd3'

import data from './test_data.json'; 
import data2 from './test_data2.json'; 

import SideBarTop from './SideBarTop';
import SideBarBottom from './SideBarBottom';
import SideBarMiddle from './SideBarMiddle';


const Settings = {
    bar_size: 0.8, // bar fill percentage
    border: 50,
    y_max: 50,
    partitions: 3,
    percentage: [0.2,0.44,0.36]
}

function Vis(){

    const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
    const [countryData, setCountryData] = useState([]); // State to store the loaded CSV data
    const [meatData, setMeatData] = useState(0);
    const [foodData, setFoodData] = useState(0);
    const [flightData, setFlightData] = useState(0);
    const [selectedCountry, setSelectedCountry] = useState({}); 
    const [policyState, setPolicyState] = useState({
        meat: false,
        flight: false,
        electric: false
    });
    const [rightDisplay, setRightDisplay] = useState(0);

    //FIX LATER
    const coEmissions = {
        meat: 0.2,
        flight: 0.05,
        electric: 0.25
    };
    const [reduction, setReduction] = useState({});

    const svgRef = useRef();

    // Load CSV data
    useEffect(() => {
        csv('/data/merged_data.csv').then(data2 => {
            const filteredAndSorted = data2
            .filter(d => Number(d['2022']) > 5) 
            .sort((a, b) => Number(a['2022']) - Number(b['2022'])); 
        setCountryData(filteredAndSorted); 
        }).catch(error => console.error('Error loading the CSV file:', error));
    }, []); 

    // Load meat data
    //poultry,beef,mutton,pork,other,fish
    useEffect(() => {
        csv('/data/per-capita-meat-type.csv').then(data => {
          // Convert data to dictionary format
          const meatDictionary = {};
          data.forEach(row => {
            const country = row['country'];
            const meatValues = Object.keys(row).filter(key => key !== 'country').map(key => row[key]);
            meatDictionary[country] = meatValues;
          });
          setMeatData(meatDictionary);
        }).catch(error => console.error('Error loading the meat consumption file:', error));
      }, []);

    useEffect(() => {
        csv('/data/co2-per-food-kg.csv').then(data => {
          // Convert data to dictionary format
          const co2Dictionary = {};
          data.forEach(row => {
            const food = row['food'];
            const foodValues = parseFloat(row['co2pkg']);
            co2Dictionary[food] = foodValues;
          });
          setFoodData(co2Dictionary);
        }).catch(error => console.error('Error loading the food co2 file:', error));
      }, []);

      useEffect(() => {
        csv('/data/per-capita-co2-aviation-adjusted.csv').then(data => {
          // Convert data to dictionary format
          const co2Dictionary = {};
          data.forEach(row => {
            const country = row['Country'];
            const flightkg = parseFloat(row['kgCO2']);
            co2Dictionary[country] = flightkg;
          });
          setFlightData(co2Dictionary);
        }).catch(error => console.error('Error loading the flight file:', error));
      }, []);
      
    useEffect(() => {
        const reductionDict = {}
        countryData.forEach(row => {
            if(meatData != 0 && foodData != 0 && flightData != 0){
                const c = row["country"];
                // TODO: if the country isn't in the list, use values of continent instead
                var meatco2 = coEmissions["meat"];
                var flightco2 = coEmissions["flight"];
                if(meatData[c] !== undefined){
                    meatco2 = meatData[c][0]*foodData["Poultry"] + meatData[c][1]*foodData["Beef (beef herd)"] + meatData[c][2]*foodData["Mutton"] + meatData[c][3]*foodData["Pork"] + meatData[c][5]*foodData["Fish (farmed)"];
                    meatco2 = meatco2*0.001/row["2022"];
                } 
                
                if (flightData[c] !== undefined){
                    flightco2 = flightData[c]
                    flightco2 = flightco2*0.001/row["2022"]
                }

                reductionDict[c] = 1-(meatco2*policyState["meat"]+flightco2*policyState["flight"]+coEmissions["electric"]*policyState["electric"])
            }
        })

        setReduction(reductionDict);
    },[policyState, reduction]);

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
    // this one should be replaced with countries
        const yAxis = axisRight(reverse_y_scale);

        const gy = svg.selectAll(".y-axis").data([null]);

        // Appends line but currently doesnt do it exaxtly the right place (should be 2.3)
// Add a tooltip container

svg.append('line')
.attr('x1', Settings.border)  // Starting x-coordinate
.attr('y1', reverse_y_scale(0.7))  // Starting y-coordinate
.attr('x2', bar_window_size.width + Settings.border)  // Ending x-coordinate
.attr('y2', reverse_y_scale(0.7))  // Ending y-coordinate
.attr('stroke', 'green')  // Line color
.attr('stroke-width', 2)  // Line thickness
.attr('stroke-dasharray', '5 5');  // Dashed line style

const tooltip = svg.append('g')
    .attr('class', 'tooltip')
    .style('display', 'none');

// Add a tooltip background rectangle

// Add the tooltip text
const tooltipText = tooltip.append('text')
    .attr('x', Settings.border + 10)
    .attr('y', reverse_y_scale(2.3) - 80);

// Add text for the parallel line
const targetText = svg.append('text')
    .attr('x', Settings.border + 10) // Adjust the position as needed
    .attr('y', reverse_y_scale(2.3) - 60) // Adjust the position as needed
    .text('The global average emissions per capita needed to reach the 1.5°C goal')
    .attr('fill', 'green')
    .style('cursor', 'pointer') // Change cursor to pointer on hover
    .on('mouseover', showTooltip)
    .on('mouseout', hideTooltip);

// Function to show the tooltip
function showTooltip() {
    tooltip.style('display', 'block');
    tooltipText.text('Target goal: 2.3 tonnes CO2 per capita');
}

// Function to hide the tooltip
function hideTooltip() {
    tooltip.style('display', 'none');
}



        

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

        // gx.enter()
        // .append("g")
        //     .attr("class", "x-axis")
        // .merge(gx)
        //     .attr("transform", `translate(${Settings.border},${Settings.border + bar_window_size.height + 5})`)
        //     .call(xAxis.ticks(svgSize.width > 600 ? countryData.length : countryData.length / 2))
        //     .call(g => g.select(".domain").remove())
        //     .selectAll(".tick")
        //     .each(function(d, i, nodes) {
        //         if (i === nodes.length - 1) { 
        //             select(this).remove(); 
        //         }
        //     });

        // svg.selectAll('.first').data(data).join(
        //     enter => enter.append('rect').attr('class', 'first'),
        //     update => update.attr('class', 'first'),
        //     exit => exit.remove()
        // ).attr('width', () => { return Math.max(0, (bar_window_size.width / data.length) * Settings.bar_size)})
        // .attr('height', function(d) { return Math.max(0, y_scale(d)); })
        // .attr("x", function(d, i) { return (bar_window_size.width / data.length) * i + Settings.border})
        // .attr("y", (d) => {return y_scale(Settings.y_max - d) + Settings.border });
        const n = 4;
        const expandedData = countryData.flatMap(d => Array.from({ length: n }, (_, i) => ({ ...d, index: i })));
        // console.log(expandedData);

        // X-axis flags
        svg.selectAll('.small_flag')
        .data(countryData)
        .join(
            enter => enter.append("image")
                            .attr('class', 'small_flag'),
            update => update,
            exit => exit.remove()
        )
        .attr('x',bar_window_size.height + Settings.border + 5)
        .attr('y', (d, i) => 3- Settings.border - bar_width + (-i * bar_width))
        .attr('height', bar_width * Settings.bar_size)
        .attr('width', 17)
        .attr('transform', 'rotate(-270)')
        .attr("href", d => d.Flag_image_url);

        // Rectangles
        svg.selectAll('.first').data(countryData).join(
            enter => enter.append('rect').attr('class', 'first'),
            update => update.attr('class', 'first'),
            exit => exit.remove()
        ).attr('width', () => { return Math.max(0, (bar_window_size.width / countryData.length) * Settings.bar_size)})
        .attr('height', function(d) { return Math.max(0, y_scale(d['2022']))*reduction[d["country"]]; })
        .attr("x", function(d, i) { return (bar_window_size.width / countryData.length) * i + Settings.border})
        .attr("y", (d) => {return y_scale(Settings.y_max - d['2022']*reduction[d["country"]]) + Settings.border })
        .on('click', (p_e,d) => {
            setSelectedCountry(d);
            setRightDisplay(1); //open up middle display when selecting country
        });
        

 
    }, [svgSize, rightDisplay, countryData, selectedCountry, reduction]);

    const continents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];
    const [selectedContinents, setSelectedContinents] = useState([]);

    const handleToggleContinent = (continent) => {
        const updatedSelectedContinents = selectedContinents.includes(continent)
            ? selectedContinents.filter((c) => c !== continent)
            : [...selectedContinents, continent];
        setSelectedContinents(updatedSelectedContinents);
    };

    const handleSelectAll = () => {
        setSelectedContinents(continents);
    };

    const handleDeselectAll = () => {
        setSelectedContinents([]);
    };

    const filteredCountries = countryData.filter((country) =>
        selectedContinents.length === 0 ? true : selectedContinents.includes(country.continent)
    );


    return (
        <div className="VisContainer">
            <svg className="SvgBarGraph" ref={svgRef}></svg>
            <div className="SideBar">
                {/* SideBarTop component with necessary props */}
                <div className="SelectBox" onClick={() => setRightDisplay(0)}>
                    Pick & Choose
                </div>
                <div
                    className={`Component SideBarTop ${rightDisplay === 0 ? 'display' : 'no-display'}`}
                >
                    <SideBarTop
                        continents={continents}
                        selectedContinents={selectedContinents}
                        handleToggleContinent={handleToggleContinent}
                        handleSelectAll={handleSelectAll}
                        handleDeselectAll={handleDeselectAll}
                    />
                </div>
                
                <div className='SelectBox' onClick={() => setRightDisplay(1)}>Country Overview</div>
                <div className={`Component SideBarMiddle ${rightDisplay === 1 ? "display" : "no-display"}`}><SideBarMiddle selectedCountry={selectedCountry}/></div>  {/* Corrected the condition to `rightDisplay === 1` for `SideBarMiddle` */}

                <div className='SelectBox' onClick={() => setRightDisplay(2)}>Consumption Bans</div>
                <div className={`Component SideBarBottom ${rightDisplay === 2 ? "display" : "no-display"}`}><SideBarBottom setPolicyState={setPolicyState} policyState={policyState}/></div>  {/* Corrected the class to `SideBarBottom` and condition to `rightDisplay === 2` for `SideBarBottom` */}
            </div>
        </div>
    );
}
export default Vis;