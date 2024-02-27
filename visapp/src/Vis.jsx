import { useRef, useEffect, useState } from "react";
import { scaleOrdinal, stack, select, scaleLinear, axisBottom, axisLeft, axisRight, csv, schemePiYG, color, selectAll } from "d3";

import data from "./test_data.json";
import data2 from "./test_data2.json";

import SideBarTop from "./SideBarTop";
import SideBarBottom from "./SideBarBottom";
import SideBarMiddle from "./SideBarMiddle";

const Settings = {
	bar_size: 0.8, // bar fill percentage
	border: 50,
	y_max: 50,
	partitions: 3,
	percentage: [0.2, 0.44, 0.36],
};

function Vis() {
	const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
	const [countryData, setCountryData] = useState([]); // State to store the loaded CSV data
	const [selectedCountry, setSelectedCountry] = useState({});
	const [policyState, setPolicyState] = useState({
		meat: false,
		flight: false,
		electric: false,
	});
	const [rightDisplay, setRightDisplay] = useState(0);
	const [stackedData, setStackedData] = useState([]);

	//FIX LATER
	const coEmissions = {
		meat: 0.3,
		flight: 0.1,
		electric: 0.25,
	};
	const [reduction, setReductionSize] = useState(1);

	const svgRef = useRef();

	// Load CSV data
	useEffect(() => {
		csv("/data/merged_data.csv")
			.then((data2) => {
				const filteredAndSorted = data2.filter((d) => Number(d["2022"]) > 5).sort((a, b) => Number(a["2022"]) - Number(b["2022"]));
				const latest_year_data = filteredAndSorted.map((d) => d["2022"]);
				const splitData = latest_year_data.map((d) => {
					return {
						other: d - (d * coEmissions["meat"] + d * coEmissions["flight"] + d * coEmissions["electric"]),
						meat: d * coEmissions["meat"],
						flight: d * coEmissions["flight"],
						electric: d * coEmissions["electric"],
					};
				});
				const stackedData = stack().keys(Object.keys(splitData[0]))(splitData);
				setCountryData(filteredAndSorted);
				setStackedData(stackedData);
			})
			.catch((error) => console.error("Error loading the CSV file:", error));
	}, []);

	useEffect(() => {
		// console.log(policyState);
		setReductionSize(
			1 -
				(coEmissions["meat"] * policyState["meat"] +
					coEmissions["flight"] * policyState["flight"] +
					coEmissions["electric"] * policyState["electric"])
		);
	}, [policyState, reduction]);

	// update on rescale
	useEffect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				setSvgSize({
					width: entry.contentRect.width,
					height: entry.contentRect.height,
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

	useEffect(() => {
		const svg = select(svgRef.current);

		const bar_window_size = { width: svgSize.width - Settings.border * 2, height: svgSize.height - Settings.border * 2 };
		const bar_width = bar_window_size.width / countryData.length;

		const y_scale = scaleLinear([0, Settings.y_max], [0, bar_window_size.height]);

		const y_scale_stacked = scaleLinear()
			.domain([0, Settings.y_max + 4])
			.range([bar_window_size.height + 50, 0]);
		const reverse_y_scale = scaleLinear([0, Settings.y_max], [bar_window_size.height, 0]);

		const yAxis = axisRight(reverse_y_scale);

		// this one should be replaced with countries
		const xAxis = axisBottom(scaleLinear([1, countryData.length + 1], [0, bar_window_size.width]));

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
		// const n = 4;
		// const expandedData = countryData.flatMap(d => Array.from({ length: n }, (_, i) => ({ ...d, index: i })));

		// X-axis flags
		// Rectangles
		svg
			.selectAll(".first")
			.data(countryData)
			.join(
				(enter) => enter.append("rect").attr("class", "first"),
				(update) => update.attr("class", "first"),
				(exit) => exit.remove()
			)
			.style("pointer-events", "all") // Enable pointer events on the element
			.attr("width", () => {
				return Math.max(0, (bar_window_size.width / countryData.length) * Settings.bar_size);
			})
			.attr("height", function (d) {
				return Math.max(0, y_scale(d["2022"]));
			})
			.attr("x", function (d, i) {
				return (bar_window_size.width / countryData.length) * i + Settings.border;
			})
			.attr("y", (d) => {
				return y_scale(Settings.y_max - d["2022"]) + Settings.border;
			})
			.raise()
			.on("click", (p_e, d) => {
				setSelectedCountry(d);
				setRightDisplay(1); //open up middle display when selecting country
			});

		// stacked rectangles
		svg
			.append("g")
			.selectAll(".stacked")
			.data(stackedData)
			.join("g")
			.attr("fill", (d, i) => ["yellow", "red", "green", "blue"][i % 4]) // Assigning colors based on index
			.selectAll("rect")
			.data((d) => d)
			.join("rect")
			.attr("x", function (d, i) {
				return (bar_window_size.width / countryData.length) * i + Settings.border;
			})
			.attr("y", (d) => {
				return y_scale_stacked(d[1]);
			})
			.attr("width", () => {
				return Math.max(0, (bar_window_size.width / countryData.length) * Settings.bar_size);
			})
			.attr("height", function (d) {
				return y_scale_stacked(d[0]) - y_scale_stacked(d[1]);
			});

		selectAll(".first").raise();
	}, [svgSize, rightDisplay, countryData, selectedCountry, reduction]);

	return (
		<div className="VisContainer">
			<svg className="SvgBarGraph" ref={svgRef}></svg>
			<div className="SideBar">
				<div className="SelectBox" onClick={() => setRightDisplay(0)}>
					Pick & Choose
				</div>
				<div className={`Component SideBarTop ${rightDisplay === 0 ? "display" : "no-display"}`}>
					<SideBarTop />
				</div>
				<div className="SelectBox" onClick={() => setRightDisplay(1)}>
					Country Overview
				</div>
				<div className={`Component SideBarMiddle ${rightDisplay === 1 ? "display" : "no-display"}`}>
					<SideBarMiddle selectedCountry={selectedCountry} />
				</div>{" "}
				{/* Corrected the condition to `rightDisplay === 1` for `SideBarMiddle` */}
				<div className="SelectBox" onClick={() => setRightDisplay(2)}>
					Consumption Bans
				</div>
				<div className={`Component SideBarBottom ${rightDisplay === 2 ? "display" : "no-display"}`}>
					<SideBarBottom setPolicyState={setPolicyState} policyState={policyState} />
				</div>{" "}
				{/* Corrected the class to `SideBarBottom` and condition to `rightDisplay === 2` for `SideBarBottom` */}
			</div>
		</div>
	);
}
export default Vis;
