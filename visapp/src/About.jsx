import React, { useState } from "react";
import saga from "./assets/saga.jpg";
import patrik from "./assets/patrik.jpg";
import amanda from "./assets/amanda.jpg";
import dante from "./assets/dante.png";
import martin from "./assets/martin.jpg";

function About() {
	const [showLimitations, setShowLimitations] = useState(false);

	const toggleLimitations = () => {
		setShowLimitations(!showLimitations);
	};

	return (
		<div>
			<div className="TopSection">
				<div className="leftpane">
					<div className="aboutPeople">About the site</div>
					<div className="aboutTextContainer">
						<p className="aboutMainText">
							This website is a digital tool to help users understand carbon dioxide (CO2) emissions, and the impact certain products and services
							have on the total amount of emissions. All emissions shown in the bar graph are consumption-based emissions per capita. All data comes
							from
							<a href="https://www.gapminder.org/"> Gapminder</a>, <a href="https://ourworldindata.org/"> OurWorldInData</a>, and{" "}
							<a href="https://weareyard.com/"> WeAreYard</a>. Click below to see all data and where it came from!
						</p>
					</div>
				</div>

				<div className="limitationsButtonContainer">
				<button onClick={toggleLimitations} className="limitationsButton">
					{showLimitations ? "Hide Full Data Sources" : "Show Full Data Sources"}
				</button>
			</div>  
			{showLimitations && (
				<div className="dataTableContainer">
					<table className="dataTable">
						<tr>
							<th>Data</th>
							<th>Source</th>
						</tr>
						<tr>
							<td>Consumption based emissions per capita</td>
							<td>
								<a href="http://gapm.io/dco2_consumption_historic">Gapminder</a>{" "}
							</td>
						</tr>
						<tr>
							<td>GDP per capita</td>
							<td>
								<a href="http://gapm.io/dgdpcap_cppp">Gapminder</a>{" "}
							</td>
						</tr>
						<tr>
							<td>Population</td>
							<td>
								<a href="http://gapm.io/dpop">Gapminder</a>{" "}
							</td>
						</tr>
						<tr>
							<td>Meat consumption per capita</td>
							<td>
								<a href="https://ourworldindata.org/grapher/per-capita-meat-type?tab=table&country=CHN~USA~IND~ARG~PRT~ETH~JPN~GBR~BRA">
									OurWorldInData
								</a>{" "}
							</td>
						</tr>
						<tr>
							<td>Environmental impact of food</td>
							<td>
								<a href="https://ourworldindata.org/environmental-impacts-of-food">OurWorldInData</a>{" "}
							</td>
						</tr>
						<tr>
							<td>Flight emissions, adjusted for tourism</td>
							<td>
								<a href="https://ourworldindata.org/grapher/per-capita-co2-aviation-adjusted">OurWorldInData</a>{" "}
							</td>
						</tr>
						<tr>
							<td>Transporation emissions per capita</td>
							<td>
								<a href="https://ourworldindata.org/grapher/per-capita-co2-transport">OurWorldInData</a>{" "}
							</td>
						</tr>
						<tr>
							<td>Celebrity emissions</td>
							<td>
								<a href="https://weareyard.com/insights/worst-celebrity-private-jet-co2-emission-offenders">WeAreYard</a>{" "}
							</td>
						</tr>
					</table>
				</div>
			)}

				<div className="righttpane">
					<div className="aboutPeople">Limitations</div>
					<div className="aboutTextContainer">
						<p className="aboutMainText">
							<p>
								The data is gathered from different sources. There is therefore no guarantee that emissions correlate between datasets. What goes into
								each country's emissions should therefore only be considered estimates.
							</p>
							<p>
								There is also no way of calculating the exact impact of different systemic changes. For example, banning personal flights outright
								would likely lead to other problems, such as more emissions from people being forced to travel through energy inefficient means.
							</p>
							<p>
								This feature is intended to be used to better understand where emissions come from and how they can be reduced, not as a measure of
								what different changes would do for the world.
							</p>
						</p>
					</div>
				</div>
			</div>

			

			<div className="BottomSection">
				<div className="aboutPeople">This tool was made by</div>
				<div className="peopleRow">
					<div className="peopleDiv">
						<div className="nameAndLinkDiv">
							<span className="nameSpan">Amanda Hallstedt</span>
							<a href="https://www.linkedin.com/in/amandahallstedt/">LinkedIn</a>
						</div>
						<span className="aboutSpan">
							<img src={amanda}></img>
						</span>
					</div>
					<span className="peopleText r">
						I was the lead in UI/UX for this project, so I spent some time with the figma protoype and the general look/feel of our application.
						On the frontend side of it all my main focus was understanding the D3 library. Some focus went in to adding multiple visualsations in the same view, 
						like the celebrity bars, but most of it went into adding interactivity to our visualization and the different data manipulation features.
					</span>
				</div>
				<div className="peopleRow">
					<span className="peopleText l">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam venenatis dictum erat, vitae dictum ipsum bibendum quis. Aenean ipsum
						ante, volutpat quis leo at, rutrum venenatis orci. Aliquam iaculis neque erat, nec aliquam nibh volutpat eu. Ut vehicula dolor sed dapibus
						iaculis. Fusce mollis pretium consequat. Ut bibendum ipsum nec libero iaculis, in eleifend sapien fringilla. In hac habitasse platea
						dictumst. Maecenas blandit posuere libero ullamcorper venenatis. Pellentesque et ex non nisi condimentum elementum. Donec volutpat, nunc
						in dictum fermentum, velit mi egestas massa, ut dapibus augue justo id tortor.
					</span>
					<div className="peopleDiv">
						<span className="aboutSpan">
							<img src={dante}></img>
						</span>{" "}
						<div className="nameAndLinkDiv">
							<span className="nameSpan">Dante Sangregorio</span>
							<a href="https://www.linkedin.com/in/patrikhanslundqvist">LinkedIn</a>
						</div>
					</div>
				</div>
				<div className="peopleRow">
					<div className="peopleDiv">
						{" "}
						<div className="nameAndLinkDiv">
							<span className="nameSpan">Martin Håkansson</span>
							<a href="https://www.linkedin.com/in/martin-h%C3%A5kansson-3329b0269/">LinkedIn</a>
						</div>
						<span className="aboutSpan">
							<img src={martin}></img>
						</span>
					</div>
					<span className="peopleText r">
						I was the frontend lead for this project so my main task was to see that we got all the functionality in place, using prototypes/sketches made in Figma as a foundation. This included working with both React and the D3 library, along with a lot of CSS. My focus has been on developing functionality that both feel intuitive and interesting, as well as being adaptive and nice looking.
					</span>
				</div>
				<div className="peopleRow">
					<span className="peopleText l ">
						As a frontend developer for this project, my role has focused on bringing the website to life by translating design concepts and UX ideas
						into a functional and visually appealing web interface. Much of my work has been to explore functionality of the D3 library and enable
						extended data manipulation for the user.
					</span>
					<div className="peopleDiv">
						<span className="aboutSpan">
							<img src={patrik}></img>
						</span>
						<div className="nameAndLinkDiv">
							<span className="nameSpan">Patrik Lundqvist</span>
							<a href="https://www.linkedin.com/in/patrikhanslundqvist">LinkedIn</a>
						</div>
					</div>
				</div>
				<div className="peopleRow">
					<div className="peopleDiv">
						<div className="nameAndLinkDiv">
							<span className="nameSpan">Saga Jonasson</span>
							<a href="https://www.linkedin.com/in/saga-jonasson-8485772ab/">LinkedIn</a>
						</div>
						<span className="aboutSpan">
							<img src={saga}></img>
						</span>
					</div>
					<span className="peopleText r">
						My role within the project has been lead data handler and processor. I searched for and gathered data which was suitable for our project, 
						trimmed and filtered them according to the project's needs, and handled discrepencies between datasets. I also worked with bringing data-based 
						features, such as allowing the user to see and remove certain "slices" of emissions from the total, to life. 
					</span>
				</div>
			</div>
		</div>
	);
}

export default About;
