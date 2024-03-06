import { useRef, useEffect, useState } from "react";
import { select, scaleLinear, axisBottom, axisLeft, axisRight, csv, line, text , count} from "d3";

import data from "./test_data.json";
import data2 from "./test_data2.json";

import SideBarTop from "./SideBarTop";
import SideBarBottom from "./SideBarBottom";
import SideBarMiddle from "./SideBarMiddle";

const Settings = {
    bar_size: 0.8, // bar fill percentage
    border: 50,
    y_max: 30,
    partitions: 3,
    percentage: [0.2,0.44,0.36],
    flaglimit: 70
}

function Vis(){
    const [isCountryDataLoaded, setIsCountryDataLoaded] = useState(false);
    const [isMeatDataLoaded, setIsMeatDataLoaded] = useState(false);
    const [isFoodDataLoaded, setIsFoodDataLoaded] = useState(false);
    const [isFlightDataLoaded, setIsFlightDataLoaded] = useState(false);
    const [allDataLoaded, setAllDataLoaded] = useState(false);

    useEffect(() => {
        if (isCountryDataLoaded && isMeatDataLoaded && isFoodDataLoaded && isFlightDataLoaded) {
            setAllDataLoaded(true);
        }
    }, [isCountryDataLoaded, isMeatDataLoaded, isFoodDataLoaded, isFlightDataLoaded]);


    const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
    const [countryData, setCountryData] = useState([]); // State to store the loaded CSV data
    const [filteredCountryData, setFilteredCountryData] = useState([]);
    const [meatData, setMeatData] = useState(0);
    const [foodData, setFoodData] = useState(0);
    const [flightData, setFlightData] = useState(0);
    const [selectedCountry, setSelectedCountry] = useState({}); 
    const [filterRange, setFilterRange] = useState({min: 0, max: 30});
    const [policyState, setPolicyState] = useState({
        meat: false,
        flight: false,
        electric: false
    });
    // state for which right side menu item is visible
    const [rightDisplay, setRightDisplay] = useState(1);

    //FIX LATER
    const coEmissions = {
        meat: 0.2,
        flight: 0.05,
        electric: 0.25
    };
    const [reduction, setReduction] = useState({});

    const [activeContinents, setActiveContinents] = useState({
        'Europe': true,
        'Asia': false,
        'Africa': false,
        'North America': true,
        'South America': false,
        'Oceania': false,
    });
    const continentColors = {
        'Europe': '#6A8CAF',
        'Asia': '#EAB464', 
        'Africa': '#9CBFA7', 
        'North America': '#C68B8B', 
        'South America': '#F2D096', 
        'Oceania': '#92B4A7'
    };

    const handleSearch = (query) => {
    const filteredData = countryData.filter(country => activeContinents[country['continent']] && country['2022'] <= filterRange.max && country['2022'] >= filterRange.min);
    const filteredData2 = filteredData.filter(country => country.country.toLowerCase().includes(query.toLowerCase()));
    setFilteredCountryData(filteredData2);
};

    

	const svgRef = useRef();

    // Load COUNTRY data
    useEffect(() => {
        csv('/data/dataset_bothcodeandurl.csv').then(data2 => {
            const filteredAndSorted = data2
                .filter(d => Number(d['2022']) > 0)
                .sort((a, b) => Number(a['2022']) - Number(b['2022'])); 
            setCountryData(filteredAndSorted);
            setIsCountryDataLoaded(true); // Update loading state
            setSelectedCountry(filteredAndSorted[169]);
        }).catch(error => console.error('Error loading the COUNTRY file:', error));
    }, []);


    // Load meat data
    useEffect(() => {
        csv('/data/per-capita-meat-type.csv').then(data => {
            const meatDictionary = {};
            data.forEach(row => {
                const country = row['country'];
                const meatValues = Object.keys(row).filter(key => key !== 'country').map(key => row[key]);
                meatDictionary[country] = meatValues;
            });
            setMeatData(meatDictionary);
            setIsMeatDataLoaded(true); // Update loading state
        }).catch(error => console.error('Error loading the meat consumption file:', error));
    }, []);

    // Load food CO2 data
    useEffect(() => {
        csv('/data/co2-per-food-kg.csv').then(data => {
            const co2Dictionary = {};
            data.forEach(row => {
                const food = row['food'];
                const foodValues = parseFloat(row['co2pkg']);
                co2Dictionary[food] = foodValues;
            });
            setFoodData(co2Dictionary);
            setIsFoodDataLoaded(true); // Update loading state
        }).catch(error => console.error('Error loading the food co2 file:', error));
    }, []);

	useEffect(() => {
		csv("/data/per-capita-co2-aviation-adjusted.csv")
			.then((data) => {
				const co2Dictionary = {};
                data.forEach(row => {
                    const country = row['Country'];
                    const flightkg = parseFloat(row['kgCO2']);
                    co2Dictionary[country] = flightkg;
                });
                setFlightData(co2Dictionary);
                setIsFlightDataLoaded(true); // Update loading state
			})
			.catch((error) => console.error("Error loading the flight file:", error));
	}, []);

    // useEffect(() => {
    //     const handleKeyPress = (event) => {
    //         console.log(filteredCountryData)
    //         if (event.key === 'ArrowRight') {
    //         setSelectedCountry(filteredCountryData[filteredCountryData.findIndex(d => d['country'] === selectedCountry['country']) + 1]);
    //         }
    //         if (event.key === 'ArrowLeft') {
    //         setSelectedCountry(filteredCountryData[filteredCountryData.findIndex(d => d['country'] === selectedCountry['country']) - 1]);
    //         }
    //     };
    
    //     window.addEventListener('keydown', handleKeyPress);
    //     return () => {
    //       window.removeEventListener('keydown', handleKeyPress);
    //     };
    //   }, []);

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
    },[policyState, allDataLoaded]);

    useEffect(() => {
        const filteredData = countryData.filter(country => 
            activeContinents[country['continent']] &&
            country['2022'] <= filterRange.max &&
            country['2022'] >= filterRange.min
        );
    
        setFilteredCountryData(filteredData);
    }, [activeContinents, filterRange, allDataLoaded]);


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
        console.log('re-render');

        const svg = select(svgRef.current);

        const bar_window_size = {width: svgSize.width - Settings.border * 2, height: svgSize.height - Settings.border * 2}
        const bar_width = bar_window_size.width / filteredCountryData.length;
        const y_scale = scaleLinear([0, Settings.y_max],[0, bar_window_size.height]);
        const reverse_y_scale = scaleLinear([0, Settings.y_max],[bar_window_size.height, 0]);

        const yAxis = axisRight(reverse_y_scale);

        // this one should be replaced with countries
        const xAxis = axisBottom(scaleLinear([1, filteredCountryData.length + 1],[0, bar_window_size.width ]));

		const gy = svg.selectAll(".y-axis").data([null]);



		gy.enter()
			.append("g")
			.attr("class", "y-axis")
			.merge(gy)
			.attr("transform", `translate(${Settings.border - 25},${Settings.border})`)
			.call(yAxis.tickSize(bar_window_size.width + 25))
			.call((g) => g.select(".domain").remove())
			.call((g) => g.selectAll(".tick line").attr("stroke-opacity", 0.5).attr("stroke-dasharray", "2,2"))
			.call((g) => g.select(".tick:first-of-type line").attr("stroke-opacity", 0.5).attr("stroke-dasharray", null))
			.call((g) => g.selectAll(".tick text").attr("x", 4).attr("dy", -4));

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
        const expandedData = filteredCountryData.flatMap(d => Array.from({ length: n }, (_, i) => ({ ...d, index: i })));


        // X-axis flags
        // Maximum flag dimensions
        if(filteredCountryData.length < Settings.flaglimit){ // only show flags under some length
            const maxFlagWidth = 30;
            const maxFlagHeight = 15; 

            const flagWidthPercentage = 1.1;
            const flagAspectRatio = 2; // Width:Height ratio

            let flagWidth = bar_width * Settings.bar_size * flagWidthPercentage;
            let flagHeight = flagWidth / flagAspectRatio; // Maintain aspect ratio

            flagWidth = Math.min(flagWidth, maxFlagWidth);
            flagHeight = Math.min(flagHeight, maxFlagHeight);
        
            svg.selectAll('.small_flag')
                .data(filteredCountryData)
                .join(
                    enter => enter.append("image")
                                    .attr('class', 'small_flag'),
                    update => update,
                    exit => exit.remove()
                )
                .attr('x', (d, i) => (bar_window_size.width / filteredCountryData.length) * i + Settings.border + (bar_width * Settings.bar_size - flagWidth) / 2)
                .attr('y', bar_window_size.height + Settings.border + 10) 
                .attr('width', flagWidth)
                .attr('height', flagHeight) 
				.attr("href", (d) => (d.Code ? `https://flagcdn.com/${d.Code.toLowerCase()}.svg` : console.log(d.country)));
        }else{
            svg.selectAll('.small_flag').remove();
        }


        // Rectangles
        svg.selectAll('.first').data(filteredCountryData).join(
            enter => enter.append('rect').attr('class', 'first'),
            update => update,
            exit => exit.remove()
        ).attr('width', () => { return Math.max(0, (bar_window_size.width / filteredCountryData.length) * Settings.bar_size)})
        .attr('height', function(d) { return Math.max(0, y_scale(d['2022']))*reduction[d["country"]]; })
        .attr("x", function(d, i) { return (bar_window_size.width / filteredCountryData.length) * i + Settings.border})
        .attr("y", (d) => {return y_scale(Settings.y_max - d['2022']*reduction[d["country"]]) + Settings.border })
        .attr('fill', d => {return d === selectedCountry ? '#fdff80' : continentColors[d['continent']]}) 
        .on('click', (p_e, d) => {
            setSelectedCountry(d);
            setRightDisplay(1); //open up middle display when selecting country
        });

        // Appends line but currently doesnt do it exaxtly the right place (should be 2.3)
		// Add a tooltip container

		const tooltip = svg.append('g')
        .attr('class', 'tooltip')
        .style('display', 'none');

        // Add a tooltip background rectangle

        // Add the tooltip text
        const tooltipText = tooltip.append('text')
            .attr('x', Settings.border + 10)
            .attr('y', reverse_y_scale(2.3) - 80);

        const backgroundWidth = 430; 
        const backgroundHeight = 20; 
        // Text background
        const textBackground = svg.append('rect')
            .attr('class', 'textBackground')
            .style('opacity', '0.5')
            .attr('x', Settings.border - 3) 
            .attr('y', Settings.border + reverse_y_scale(2.3) - backgroundHeight -5)
            .attr('width', backgroundWidth)
            .attr('height', backgroundHeight)
            .attr('fill', 'white');

        // Add text for the parallel line
        const targetText = svg.append('text')
            .attr('x', Settings.border ) // Adjust the position as needed
            .attr('y', Settings.border + reverse_y_scale(2.3) -10) // Adjust the position as needed
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

        svg.append('line')
            .attr('x1', Settings.border)  // Starting x-coordinate
            .attr('y1', Settings.border + reverse_y_scale(2.3))  // Starting y-coordinate
            .attr('x2', bar_window_size.width + Settings.border)  // Ending x-coordinate
            .attr('y2', Settings.border + reverse_y_scale(2.3))  // Ending y-coordinate
            .attr('stroke', 'green')  // Line color
            .attr('stroke-width', 2)  // Line thickness
            .attr('stroke-dasharray', '5 5');  // Dashed line style



        
    }, [svgSize, rightDisplay, filteredCountryData, reduction, activeContinents, selectedCountry]);

    return (
        <div className="VisContainer">
            <svg className="SvgBarGraph" ref={svgRef}></svg>  
            <div className='SideBar'>  
                <div className='SelectBox' onClick={() => setRightDisplay(0)}>Pick & Choose</div>
                <div className={`Component SideBarTop ${rightDisplay === 0 ? "display" : "no-display"}`}><SideBarTop activeContinents={activeContinents} setActiveContinents={setActiveContinents} filterRange={filterRange} setFilterRange={setFilterRange} handleSearch={handleSearch} /></div>
                
                <div className='SelectBox' onClick={() => setRightDisplay(1)}>Country Overview</div>
                <div className={`Component SideBarMiddle ${rightDisplay === 1 ? "display" : "no-display"}`}><SideBarMiddle selectedCountry={selectedCountry} countryData={countryData}/></div>  {/* Corrected the condition to `rightDisplay === 1` for `SideBarMiddle` */}

                <div className='SelectBox' onClick={() => setRightDisplay(2)}>Consumption Bans</div>
                <div className={`Component SideBarBottom ${rightDisplay === 2 ? "display" : "no-display"}`}><SideBarBottom setPolicyState={setPolicyState} policyState={policyState}/></div>  {/* Corrected the class to `SideBarBottom` and condition to `rightDisplay === 2` for `SideBarBottom` */}
            </div>  
        </div>
    );
}
export default Vis;
