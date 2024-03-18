import { useRef, useEffect, useState } from "react";
import { selectAll, stack, select, scaleLinear, axisBottom, axisLeft, axisRight, csv, line, text, count, color } from "d3";

import data from "./test_data.json";
import data2 from "./test_data2.json";

import SideBarTop from "./SideBarTop";
import SideBarBottom from "./SideBarBottom";
import SideBarMiddle from "./SideBarMiddle";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Settings = {
	bar_size: 0.8, // bar fill percentage
	border: 67,
	y_max: 30,
	partitions: 3,
	percentage: [0.2, 0.44, 0.36],
	flaglimit: 70,
	maxBarSize: 150,
	rescale_speed: 0.04,
};

function Vis() {
	const [isCountryDataLoaded, setIsCountryDataLoaded] = useState(false);
	const [isMeatDataLoaded, setIsMeatDataLoaded] = useState(false);
	const [isFoodDataLoaded, setIsFoodDataLoaded] = useState(false);
	const [isFlightDataLoaded, setIsFlightDataLoaded] = useState(false);
	const [isTransportDataLoaded, setIsTransportDataLoaded] = useState(false);
	const [isCelebrityDataLoaded, setIsCelebrityDataLoaded] = useState(false);
	const [allDataLoaded, setAllDataLoaded] = useState(false);

	const rescaleModeRef = useRef(false);
	const [yMaxState, setYMaxState] = useState(30);
	const celebs = [
		"Taylor Swift",
		"Drake",
		"Floyd Mayweather",
		"Jay-Z",
		"Kim Kardashian",
		"A-Rod",
		"Steven Spielberg",
		"Mark Wahlberg",
		"Blake Shelton",
		"Jack Nicklaus",
	];
	const initialCelebActive = {
		"Taylor Swift": false,
		Drake: false,
		"Floyd Mayweather": false,
		"Jay-Z": false,
		"Kim Kardashian": false,
		"A-Rod": false,
		"Steven Spielberg": false,
		"Mark Wahlberg": false,
		"Blake Shelton": false,
		"Jack Nicklaus": false,
	};
	const celebColors = {
		"Taylor Swift": "#E57373", // Soft Red
		Drake: "#81C784", // Green
		"Floyd Mayweather": "#64B5F6", // Light Blue
		"Jay-Z": "#FFD54F", // Yellow
		"Kim Kardashian": "#BA68C8", // Purple
		"A-Rod": "#4DB6AC", // Teal
		"Steven Spielberg": "#FF8A65", // Coral
		"Mark Wahlberg": "#90A4AE", // Blue Grey
		"Blake Shelton": "#AED581", // Lime Green
		"Jack Nicklaus": "#FFB74D", // Orange
	};
	const policyColors = {
		meat: '#C6A0DA',
		flight: '#E37C7C',
		transport: '#A2E7DC'
	}

	const [continentORstacked, setcontinentORstacked] = useState(0);

	const [celebStatus, setCelebStatus] = useState(initialCelebActive);

	const toggleVisState = (newstate) => {
		console.log(newstate);
		setcontinentORstacked(newstate);
	};

	let activeCelebs = [];

	const toggleCeleb = (celebName) => {
		setCelebStatus((prevStatus) => ({
			...prevStatus,
			[celebName]: !prevStatus[celebName],
		}));
	};

	const celebrityDataRef = useRef([]);

	useEffect(() => {
		if (isCountryDataLoaded && isMeatDataLoaded && isFoodDataLoaded && isFlightDataLoaded && isTransportDataLoaded && isCelebrityDataLoaded) {
			setAllDataLoaded(true);
		}
	}, [isCountryDataLoaded, isMeatDataLoaded, isFoodDataLoaded, isFlightDataLoaded, isTransportDataLoaded]);

	const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
	const [countryData, setCountryData] = useState([]); // State to store the loaded CSV data
	const [filteredCountryData, setFilteredCountryData] = useState([]);
	const [meatData, setMeatData] = useState(0);
	const [foodData, setFoodData] = useState(0);
	const [flightData, setFlightData] = useState(0);
	const [transportData, setTransportData] = useState(0);
	const [selectedCountry, setSelectedCountry] = useState({});
	const [filterRange, setFilterRange] = useState({ min: 0, max: 30 });
	const [policyState, setPolicyState] = useState({
		other: false,
		meat: false,
		flight: false,
		transport: false,
	});
	// state for which right side menu item is visible
	const [rightDisplay, setRightDisplay] = useState(2);

	// data needed for stacked rectangles
	const [splitData, setSplitData] = useState([]);
	const [stackDataPolicyState, setStackedDataPolicyState] = useState([]);

	//FIX LATER
	const coEmissions = {
		meat: 0.2,
		flight: 0.05,
		electric: 0.25,
	};
	const [reduction, setReduction] = useState({});

	const [activeContinents, setActiveContinents] = useState({
		Europe: true,
		Asia: false,
		Africa: false,
		"North America": true,
		"South America": false,
		Oceania: false,
	});
	const continentColors = {
		Europe: "#8CB4D0",
		Asia: "#F8CA86",
		Africa: "#B3A6D6",
		"North America": "#C68B8B",
		"South America": "#99BD8D",
		Oceania: "#81C8B3",
	};

	const handleSearch = (query) => {
		const filteredData = countryData.filter(
			(country) => activeContinents[country["continent"]] && country["2022"] <= filterRange.max && country["2022"] >= filterRange.min
		);
		const filteredData2 = filteredData.filter((country) => country.country.toLowerCase().includes(query.toLowerCase()));
		setFilteredCountryData(filteredData2);
	};

	const svgRef = useRef();

	// Load COUNTRY data
	useEffect(() => {
		csv("/data/co2_pcap_cons.csv")
			.then((data2) => {
				
				const filteredAndSorted = data2.filter((d) => Number(d["2022"]) > 0).sort((a, b) => Number(a["2022"]) - Number(b["2022"]));
				setCountryData(filteredAndSorted);
				setIsCountryDataLoaded(true); // Update loading state
				setSelectedCountry(filteredAndSorted[169]);
			})
			.catch((error) => console.error("Error loading the COUNTRY file:", error));
	}, []);

	// Load Celebrity data
	useEffect(() => {
		csv("/data/celebrity-data.csv")
			.then((data2) => {
				const updatedData = data2.slice(0, -1);
				celebrityDataRef.current = updatedData;
				setIsCelebrityDataLoaded(true);
			})
			.catch((error) => console.error("Error loading the Celebrity file:", error));
	}, []);

	// Load meat data
	useEffect(() => {
		csv("/data/per-capita-meat-type.csv")
			.then((data) => {
				const meatDictionary = {};
				data.forEach((row) => {
					const country = row["country"];
					const meatValues = Object.keys(row)
						.filter((key) => key !== "country")
						.map((key) => row[key]);
					meatDictionary[country] = meatValues;
				});
				setMeatData(meatDictionary);
				setIsMeatDataLoaded(true); // Update loading state
			})
			.catch((error) => console.error("Error loading the meat consumption file:", error));
	}, []);

	// Load food CO2 data
	useEffect(() => {
		csv("/data/co2-per-food-kg.csv")
			.then((data) => {
				const co2Dictionary = {};
				data.forEach((row) => {
					const food = row["food"];
					const foodValues = parseFloat(row["co2pkg"]);
					co2Dictionary[food] = foodValues;
				});
				setFoodData(co2Dictionary);
				setIsFoodDataLoaded(true); // Update loading state
			})
			.catch((error) => console.error("Error loading the food co2 file:", error));
	}, []);

	useEffect(() => {
		csv("/data/per-capita-co2-aviation-adjusted.csv")
			.then((data) => {
				const co2Dictionary = {};
				data.forEach((row) => {
					const country = row["Country"];
					const flightkg = parseFloat(row["kgCO2"]);
					co2Dictionary[country] = flightkg;
				});
				setFlightData(co2Dictionary);
				setIsFlightDataLoaded(true); // Update loading state
			})
			.catch((error) => console.error("Error loading the flight file:", error));
	}, []);

	useEffect(() => {
		csv("/data/per-capita-transport-co2.csv")
			.then((data) => {
				const tDictionary = {};
				data.forEach((row) => {
					const country = row["country"];
					const transporttonnes = parseFloat(row["transportco2"]);
					tDictionary[country] = transporttonnes;
				});
				setTransportData(tDictionary);
				setIsTransportDataLoaded(true); // Update loading state
			})
			.catch((error) => console.error("Error loading the transport file:", error));
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
		const reductionDict = {};
		countryData.forEach((row) => {
			if (allDataLoaded) {
				const c = row["country"];
				// TODO: if the country isn't in the list, use values of continent instead
				var meatco2 = coEmissions["meat"];
				var flightco2 = coEmissions["flight"];
				var transportco2 = coEmissions["electric"];
				if (meatData[c] !== undefined) {
					meatco2 =
						meatData[c][0] * foodData["Poultry"] +
						meatData[c][1] * foodData["Beef (beef herd)"] +
						meatData[c][2] * foodData["Mutton"] +
						meatData[c][3] * foodData["Pork"] +
						meatData[c][5] * foodData["Fish (farmed)"];
					meatco2 = (meatco2 * 0.001) / row["2022"];
				}

				if (flightData[c] !== undefined) {
					flightco2 = flightData[c];
					flightco2 = (flightco2 * 0.001) / row["2022"];
				}

				if (transportData[c] !== undefined) {
					transportco2 = transportData[c];
					transportco2 = transportco2 / row["2022"];
				}

				reductionDict[c] = 1 - (meatco2 * policyState["meat"] + flightco2 * policyState["flight"] + transportco2 * policyState["transport"]);
				if (meatco2 + flightco2 + transportco2 > 1) {
					reductionDict[c] = 1;
				}
			}
		});
		setReduction(reductionDict);
	}, [policyState, allDataLoaded]);

	useEffect(() => {
		const filteredData = countryData.filter(
			(country) => activeContinents[country["continent"]] && country["2022"] <= filterRange.max && country["2022"] >= filterRange.min
		);

		setFilteredCountryData(filteredData);
	}, [activeContinents, filterRange, allDataLoaded]);

	useEffect(() => {
		if (countryData.length === 0) {
			return;
		}
		const splitData = countryData
			.map((row) => {
				if (allDataLoaded && activeContinents[row["continent"]] && row["2022"] <= filterRange.max && row["2022"] >= filterRange.min) {
					const c = row["country"];
					// TODO: if the country isn't in the list, use values of continent instead
					var meatco2 = coEmissions["meat"];
					var flightco2 = coEmissions["flight"];
					var transportco2 = coEmissions["electric"];
					if (meatData[c] !== undefined) {
						meatco2 =
							(meatData[c][0] * foodData["Poultry"] +
								meatData[c][1] * foodData["Beef (beef herd)"] +
								meatData[c][2] * foodData["Mutton"] +
								meatData[c][3] * foodData["Pork"] +
								meatData[c][5] * foodData["Fish (farmed)"]) *
							0.001;
					}

					if (flightData[c] !== undefined) {
						flightco2 = flightData[c] * 0.001;
					}

					if (transportData[c] !== undefined) {
						transportco2 = transportData[c];
					}

					return row["2022"] - (meatco2 + flightco2 + transportco2) > 0
						? {
								other: row["2022"] - (meatco2 + flightco2 + transportco2),
								meat: meatco2,
								flight: flightco2,
								transport: transportco2,
						  }
						: {
								other: row["2022"],
								meat: 0,
								flight: 0,
								transport: 0,
						  };
				}
			})
			.filter(Boolean);

		if (splitData.length > 0) {
			// const stackedData = stack().keys(Object.keys(splitData[0]))(splitData);
			setSplitData(splitData);
		}
	}, [policyState, activeContinents, filterRange, allDataLoaded]);

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

	// this is for the y-axis scaling,
	const y_scale_start_value = useRef(null);
	const y_scale_old_max = useRef(null);

	useEffect(() => {
		const handleMouseUp = () => {
			rescaleModeRef.current = false;
			y_scale_start_value.current = null;
		};
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, []);

	useEffect(() => {
		const handleMouseMove = (event) => {
			if (!rescaleModeRef.current) return;

			if (y_scale_start_value.current == null) {
				y_scale_start_value.current = event.clientY;
				y_scale_old_max.current = yMaxState;
				return;
			}

			const delta = event.clientY - y_scale_start_value.current;
			setYMaxState(Math.min(3500,Math.max(1, y_scale_old_max.current + delta * Settings.rescale_speed * (yMaxState > 50 ? yMaxState / 50 : 1))));
		};

		document.addEventListener("mousemove", handleMouseMove);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
		};
	}, [yMaxState]);

	useEffect(() => {
		if (!rescaleModeRef.current) {
			y_scale_old_max.current = yMaxState;
		}
	}, [yMaxState]);

	// *** MAIN UPDATE USEEFFECT ***
	useEffect(() => {
		console.log("update");
		const svg = select(svgRef.current);

		activeCelebs = [];
		for (const [celebName, isActive] of Object.entries(celebStatus)) {
			if (isActive) {
				const celebObject = celebrityDataRef.current.find((celebrity) => celebrity.celebrity === celebName);
				if (celebObject) {
					activeCelebs.push(celebObject);
				}
			}
		}
		activeCelebs.sort((a, b) => a.co2kg - b.co2kg);

		//console.log(activeCelebs);

		const bar_window_size = { width: svgSize.width - Settings.border * 2, height: svgSize.height - Settings.border * 2 };
		const bar_width = bar_window_size.width / (filteredCountryData.length + activeCelebs.length);
		const y_scale = scaleLinear([0, yMaxState], [0, bar_window_size.height]);
		const reverse_y_scale = scaleLinear([0, yMaxState], [bar_window_size.height, 0]);

		const yAxis = axisRight(reverse_y_scale);

		// const y_scale_stacked = scaleLinear().domain([1.5, yMaxState]).range([bar_window_size.height, 0]);
		const y_scale_stacked = scaleLinear([0, yMaxState], [bar_window_size.height, 0]);

		// this one should be replaced with countries
		const xAxis = axisBottom(scaleLinear([1, filteredCountryData.length + 1], [0, bar_window_size.width]));

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

		var textSelection = svg.selectAll(".target.y-axis-label").data([0]);

		textSelection.enter()
			.append("text")
			.merge(textSelection)
				.attr("class", "target y-axis-label")
				.attr("fill", window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)")
				.attr("font-size", "10px")
				.text("Consumption based CO2 emissions per capita (Tons)")
				.attr("x", -svgSize.height / 2 - Settings.border)
				.attr("y", Settings.border - 10)
				.attr("transform", `rotate(-90, ${Settings.border - 50}, ${Settings.border - 20})`);

		textSelection.exit().remove();


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
		// .attr("y", (d) => {return y_scale(yMaxState - d) + Settings.border });

		const n = 4;
		const expandedData = filteredCountryData.flatMap((d) => Array.from({ length: n }, (_, i) => ({ ...d, index: i })));

		// X-axis flags
		// Maximum flag dimensions
		if (filteredCountryData.length < Settings.flaglimit) {
			// only show flags under some length
			const maxFlagWidth = 30;
			const maxFlagHeight = 15;

			const flagWidthPercentage = 1.1;
			const flagAspectRatio = 2; // Width:Height ratio

			let flagWidth = bar_width * Settings.bar_size * flagWidthPercentage;
			let flagHeight = flagWidth / flagAspectRatio; // Maintain aspect ratio

			flagWidth = Math.min(flagWidth, maxFlagWidth);
			flagHeight = Math.min(flagHeight, maxFlagHeight);

			svg
				.selectAll(".small_flag")
				.data(filteredCountryData)
				.join(
					(enter) => enter.append("image").attr("class", "small_flag"),
					(update) => update,
					(exit) => exit.remove()
				)
				.attr(
					"x",
					(d, i) => (bar_window_size.width / (filteredCountryData.length + activeCelebs.length)) * i + Settings.border + (bar_width * Settings.bar_size - flagWidth) / 2
				)
				.attr("y", bar_window_size.height + Settings.border + 10)
				.attr("width", flagWidth)
				.attr("height", flagHeight)
				.attr("href", (d) => (d.Code ? `https://flagcdn.com/${d.Code.toLowerCase()}.svg` : console.log(d.country)));
		} else {
			svg.selectAll(".small_flag").remove();
		}

		// y scale rectangle
		let rectangle = svg.select(".y-scale-rect");

		if (rectangle.empty()) {
			rectangle = svg.append("rect").attr("class", "y-scale-rect");
		}

		rectangle
			.attr("height", `${svgSize.height - Settings.border * 1}`)
			.attr("width", 39)
			.attr("transform", `translate(${Settings.border - 35}, ${0})`)
			.attr("fill", "red")
			.style("opacity", "0.0")
			.on("mousedown", function () {
				rescaleModeRef.current = true;
				select(this).attr("fill", "blue");
			});

		const absolute_bar_width = Math.min(
			Settings.maxBarSize,
			Math.max(0, (bar_window_size.width / (filteredCountryData.length + activeCelebs.length)) * Settings.bar_size)
		);

		// Rectangles
		!continentORstacked
			? svg
					.selectAll(".first")
					.data(filteredCountryData)
					.join(
						(enter) => enter.append("rect").attr("class", "first"),
						(update) => update,
						(exit) => exit.remove()
					)
					.attr("width", () => {
						return absolute_bar_width;
					})
					.attr("height", function (d) {
						return Math.min(svgSize.height - Settings.border * 2, Math.max(0, y_scale(d["2022"])) * reduction[d["country"]]);
					})
					.attr("x", function (d, i) {
						return (
							(bar_window_size.width / (filteredCountryData.length + activeCelebs.length)) * i +
							Settings.border +
							(bar_width * 0.8) / 2 -
							absolute_bar_width / 2
						);
					})
					.attr("y", (d) => {
						return y_scale(d["2022"]) * reduction[d["country"]] >= svgSize.height - Settings.border * 2
							? Settings.border
							: y_scale(yMaxState - d["2022"] * reduction[d["country"]]) + Settings.border;
					})
					.attr("fill", (d) => {
						return d === selectedCountry ? "#7e7e7e" : continentColors[d["continent"]];
					})
					.on("click", (p_e, d) => {
						setSelectedCountry(d);
						setRightDisplay(1); //open up middle display when selecting country
					})
					.on("mouseover", (e, d) => {
						console.log()
						barTooltip.select(".tooltipCountry").text(d.country);
						barTooltip
							.style("display", "block")
							.style("top", `${svgSize.height - 70}px`)
							.style("left", `${
								e.pageX
							}px`);
					})
					.on("mouseleave", () => {
						barTooltip.style("display", "none");
					})
					.style("pointer-events", "all")
					.attr("opacity", "1")
			: svg.selectAll(".first").attr("opacity", "0");

		// const barTooltip = select("#barTooltip");

		// celeb rects
		const celebOffset = filteredCountryData.length * (bar_window_size.width / (filteredCountryData.length + activeCelebs.length));

		svg
			.selectAll(".celeb")
			.data(activeCelebs)
			.join(
				(enter) => enter.append("rect").attr("class", "celeb"),
				(update) => update,
				(exit) => exit.remove()
			)
			.attr("width", absolute_bar_width)
			.attr("height", (d) => Math.min(svgSize.height - Settings.border * 2, Math.max(0, y_scale(d.co2kg / 1000))))
			.attr(
				"x",
				(d, i) =>
					celebOffset +
					(bar_window_size.width / (filteredCountryData.length + activeCelebs.length)) * i +
					Settings.border +
					(absolute_bar_width * 0.8) / 2 -
					absolute_bar_width / 2
			)
			.attr("y", (d) => svgSize.height - Math.min(svgSize.height - Settings.border * 2, Math.max(0, y_scale(d.co2kg / 1000))) - Settings.border)
			.attr("fill", (d) => `${celebColors[d.celebrity]}`)
			.on("mouseover", (e, d) => {
				barTooltip.select(".tooltipCountry").text(d.celebrity);
				barTooltip
					.style("display", "block")
					.style("top", `${svgSize.height - 70}px`)
					.style("left", `${
								e.pageX
							}px`);
			})
			.on("mouseleave", () => {
				barTooltip.style("display", "none");
			});

		// svg
		// 	.selectAll(".first")
		// 	.data(filteredCountryData)
		// 	.join(
		// 		(enter) => enter.append("rect").attr("class", "first"),
		// 		(update) => update,
		// 		(exit) => exit.remove()
		// 	)
		// 	.attr("width", () => {
		// 		return absolute_bar_width;
		// 	})
		// 	.attr("height", function (d) {
		// 		return Math.min(svgSize.height - Settings.border * 2, Math.max(0, y_scale(d["2022"])) * reduction[d["country"]]);
		// 	})
		// 	.attr("x", function (d, i) {
		// 		return (bar_window_size.width / filteredCountryData.length) * i + Settings.border + (bar_width * 0.8) / 2 - absolute_bar_width / 2;
		// 	})
		// 	.attr("y", (d) => {
		// 		return y_scale(d["2022"]) * reduction[d["country"]] >= svgSize.height - Settings.border * 2
		// 			? Settings.border
		// 			: y_scale(yMaxState - d["2022"] * reduction[d["country"]]) + Settings.border;
		// 	})
		// 	.attr("fill", (d) => {
		// 		return d === selectedCountry ? "#fdff80" : continentColors[d["continent"]];
		// 	})
		// 	.on("click", (p_e, d) => {
		// 		setSelectedCountry(d);
		// 		setRightDisplay(1); //open up middle display when selecting country
		// 	});

		// // stacked rectangles
		// if (splitData.length > 0) {
		// 	const stackedData = stack().keys(Object.keys(policyState).filter((key) => policyState[key] === false))(splitData);

		// 	const colorsStackedRectangles = ["yellow", "red", "green", "blue"].filter((_, i) => Object.values(policyState)[i] === false);

		// 	// const testSplitData = Array.from({ length: 68 }, () => ({ other: 10, meat: 10, flight: 10, transport: 10 }));
		// 	// const testData = stack().keys(["other", "meat", "flight", "transport"])(testSplitData);
		// 	svg
		// 		.append("g")
		// 		.selectAll(".stacked")
		// 		.data(stackedData)
		// 		.join("g")
		// 		.attr("fill", (d, i) => colorsStackedRectangles[i % 4]) // Assigning colors based on index
		// 		.selectAll("rect")
		// 		.data((d) => d)
		// 		.join("rect")
		// 		.attr("x", function (d, i) {
		// 			return (bar_window_size.width / countryData.length) * i + Settings.border;
		// 		})
		// 		.attr("y", (d) => {
		// 			return y_scale_stacked(d[1]) + 10;
		// 		})
		// 		.attr("width", () => {
		// 			return Math.max(0, (bar_window_size.width / countryData.length) * Settings.bar_size);
		// 		})
		// 		.attr("height", function (d) {
		// 			return y_scale_stacked(d[0]) - y_scale_stacked(d[1]);
		// 		});

		// 	selectAll(".first").raise();
		// }

		// stacked rectangles
		// Assuming 'svg' is already defined and appended to the DOM
		// Assuming 'stackedData' is your data array ready for use

		if (
			splitData.length > 0 &&
			Object.values(activeContinents).some((x) => x === true) &&
			filteredCountryData.length > 0 &&
			continentORstacked === 1
		) {
			const stackedData = stack().keys(Object.keys(policyState).filter((key) => policyState[key] === false))(splitData);
		
			const colorsStackedRectangles = ["#a6a3a1", "#edb4d4", "#add6db", "#edac6f"].filter((_, i) => Object.values(policyState)[i] === false);
		
			// Define legend data
			const legendData = Object.keys(policyState).filter((key) => policyState[key] === false);
			
			// Define legend position
			const legendX = 100; // Initial x position
			const legendY = 40; // Initial y position
			const legendPadding = 5; // Padding between rectangle and text
			
			// Create legend
			const legend = svg.selectAll(".legend")
				.data(legendData)
				.enter().append("g")
				.attr("class", "legend")
				.attr("transform", (d, i) => `translate(${legendX}, ${legendY + i * 30})`);
			
			// Add legend colored rectangles
			legend.append("circle")
				.attr("cx", 10) // x position of the center of the circle
				.attr("cy", 7.5) // y position of the center of the circle
				.attr("r", 7.5) // radius of the circle
				.style("fill", (d, i) => colorsStackedRectangles[i]);
			
			// Add legend text
			legend.append("text")
				.attr("x", 24) // Adjusted position
				.attr("y", 9)
				.attr("dy", ".35em")
				.text((d) => d);
			
		
			// const testSplitData = Array.from({ length: 68 }, () => ({ other: 10, meat: 10, flight: 10, transport: 10 }));
			// const stackedData = stack().keys(["other", "meat", "flight", "transport"])(testSplitData);
			// Bind the stacked data to the group elements
			const seriesGroups = svg.selectAll(".stacked").data(stackedData, (d) => d.key); // Use a unique identifier for each series
		
			// Enter selection for the groups
			const enteredSeriesGroups = seriesGroups
				.enter()
				.append("g")
				.attr("class", "stacked")
				.attr("fill", (d, i) => colorsStackedRectangles[i % 4]); // Set the fill color here
		
			seriesGroups.attr("fill", (d, i) => colorsStackedRectangles[i % 4]);
		
			seriesGroups.exit().remove();
		
			enteredSeriesGroups.merge(seriesGroups).each(function(seriesData) {
				const rects = select(this)
					.selectAll("rect")
					.data(seriesData, (d) => d.data.key)
					.style("pointer-events", "none"); // Assuming each data point has a unique 'key' property
		
				rects
					.enter()
					.append("rect")
					.attr(
						"x",
						(d, i) =>
						(bar_window_size.width / (filteredCountryData.length + activeCelebs.length)) * i +
						Settings.border +
						(bar_width * 0.8) / 2 -
						absolute_bar_width / 2
					)
					.attr("y", (d) => y_scale_stacked(d[1]) + 50)
					.attr("width", absolute_bar_width)
					.attr("height", (d) => y_scale_stacked(d[0]) - y_scale_stacked(d[1]))
					.style("pointer-events", "none");
		
				rects
					.attr(
						"x",
						(d, i) =>
						(bar_window_size.width / (filteredCountryData.length + activeCelebs.length)) * i +
						Settings.border +
						(bar_width * 0.8) / 2 -
						absolute_bar_width / 2
					)
					.attr("y", (d) => y_scale_stacked(d[1]))
					.attr("width", absolute_bar_width)
					.attr("height", (d) => y_scale_stacked(d[0]) - y_scale_stacked(d[1]))
					.style("pointer-events", "none");
		
				rects.exit().remove();
			});
		
			// selectAll(".first").raise();
		} else {
			selectAll(".stacked").remove();
			selectAll(".legend").remove(); // Remove legend when condition is false
		}
		

		const barTooltip = select("#barTooltip");

		// Add a tooltip container
		const tooltip = svg.append("g").attr("class", "tooltip").style("display", "none");

		// Add a tooltip background rectangle

		// Add the tooltip text
		const tooltipText = tooltip
			.append("text")
			.attr("x", Settings.border + 10)
			.attr("y", reverse_y_scale(2.3) - 80);

		const backgroundWidth = 430;
		const backgroundHeight = 20;
		const textBackground = svg.selectAll(".textBackground").data([null]);

		const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(10, 10)");


	




		// Text background
		textBackground
			.enter()
			.append("rect")
			.attr("class", "textBackground")
			.style("opacity", "0.5")
			.attr("fill", "white")
			.merge(textBackground)
			.attr("x", Settings.border - 3)
			.attr("y", Settings.border + reverse_y_scale(2.3) - backgroundHeight - 5)
			.attr("width", backgroundWidth)
			.attr("height", backgroundHeight)
			.raise();

		// Add text for the parallel line
		const targetText = svg.selectAll(".targetText").data([null]);
		targetText
			.enter()
			.append("text")
			.attr("class", "targetText")
			.attr("fill", "#7c7c7c")
			.style("cursor", "pointer")
			.style("z-order", "-1")
			.on("mouseover", showTooltip)
			.on("mouseout", hideTooltip)
			.text("The global average emissions per capita needed to reach the 1.5°C goal")
			.merge(targetText)
			.attr("x", Settings.border) // Adjust the position as needed
			.attr("y", Settings.border + reverse_y_scale(2.3) - 10) // Adjust the position as needed
			.raise();

		// Function to show the tooltip
		function showTooltip() {
			tooltip.style("display", "block");
			tooltipText.text("Target goal: 2.3 tonnes CO2 per capita");
		}

		// Function to hide the tooltip
		function hideTooltip() {
			tooltip.style("display", "none");
		}

		// Bind a single-element array to prepare for the enter-update-exit pattern
		var co2_line = svg.selectAll(".co2_line").data([null]);

		// Enter selection: append the line if it doesn't exist
		co2_line
			.enter()
			.append("line")
			.attr("class", "co2_line")
			.attr("stroke", "#7c7c7c") // Line color
			.attr("stroke-width", 2) // Line thickness
			.attr("stroke-dasharray", "5 3") // Dashed line style
			.merge(co2_line) // Merge enter and update selections
			.attr("x1", Settings.border) // Starting x-coordinate
			.attr("y1", Settings.border + reverse_y_scale(2.3)) // Starting y-coordinate
			.attr("x2", bar_window_size.width + Settings.border) // Ending x-coordinate
			.attr("y2", Settings.border + reverse_y_scale(2.3)) // Ending y-coordinate
			.raise();
	}, [continentORstacked, svgSize, filteredCountryData, reduction, activeContinents, selectedCountry, yMaxState, celebStatus]);

	return (
		<div className="VisContainer">
			<svg className="SvgBarGraph" ref={svgRef}></svg>
			<div className="SideBar">
				<div className="Menu">
					<div className={`SelectBox ${rightDisplay === 0 ? "selected" : ""}`} onClick={() => setRightDisplay(0)}>
						Filter
					</div>
					<div className={`SelectBox ${rightDisplay === 1 ? "selected" : ""}`} onClick={() => setRightDisplay(1)}>
						Country
					</div>
					<div className={`SelectBox ${rightDisplay === 2 ? "selected" : ""}`} onClick={() => setRightDisplay(2)}>
						Explore
					</div>
				</div>
				{rightDisplay === 0 && (
					<SideBarTop
						activeContinents={activeContinents}
						setActiveContinents={setActiveContinents}
						filterRange={filterRange}
						setFilterRange={setFilterRange}
						setYMaxState={setYMaxState}
						handleSearch={handleSearch}
						toggleVisState={toggleVisState}
						continentORstacked={continentORstacked}
					/>
				)}
				{rightDisplay === 1 && allDataLoaded && (
					<SideBarMiddle
						selectedCountry={selectedCountry}
						countryData={countryData}
						meatData={meatData}
						foodData={foodData}
						flightData={flightData}
						transportData={transportData}
					/>
				)}
				{rightDisplay === 2 && (
					<SideBarBottom
						celebrityData={celebrityDataRef.current}
						setPolicyState={setPolicyState}
						policyState={policyState}
						toggleCeleb={toggleCeleb}
						celebStatus={celebStatus}
						celebColors={celebColors}
						policyColors={policyColors}
					/>
				)}
			</div>
			<div id="barTooltip">
				<div className="tooltipCountry"></div>
			</div>
		</div>
	);
}
export default Vis;
