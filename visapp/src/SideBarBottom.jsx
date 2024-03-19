import { useState } from "react";

const checkBoxData = {
	meat: "Remove meat consumption",
	flight: "Remove personal flights",
	transport: "Remove other personal transportation",
};


function SideBarBottom(props) {
	const handleToggle = (key) => {
		props.setPolicyState((prevState) => ({ ...prevState, [key]: !prevState[key] }));
	};

	const [hoverStyle, setHoverStyle] = useState({});
	const handleMouseEnter = (color) => {
		setHoverStyle({
			backgroundColor: color, 
			cursor: 'pointer',
		});
	};

	return (
		<div className="BottomContainer Container">
			<div className="ElementComponent">
				<h2>Apply restrictions</h2>
			</div>
			<div className="ElementComponent">
				<div className="policyCheckboxes">
					{Object.keys(checkBoxData).map((key) => (
						<label 
						key={key} 
						style={hoverStyle} 
						onMouseEnter={() => handleMouseEnter(key)} 
						onMouseLeave={()=> {return false}}
						>
							<input type="checkbox" onChange={() => handleToggle(key)} name={key} checked={props.policyState[key]} className="checkboxColor" />
							<span className="checkBoxLabel">{checkBoxData[key]}</span>
						</label>
					))}
				</div>
			</div>
			<div className="ElementComponent">
				<h2>Add a celebrity</h2>
				<p className="celebExplText">Add a celebrity to directly compare their CO2 emissions to the average person's.<em><br></br><br></br>PS: You may need to rescale the graph.</em></p>
				<div className="celebFlexbox">
					{Object.entries(props.celebrityData).map(([key, d]) => (
						<div
							className={`celebSelector ${props.celebStatus[d.celebrity] ? "selected" : ""}`}
							style={{ backgroundColor: props.celebStatus[d.celebrity] ? props.celebColors[d.celebrity] : `${props.celebColors[d.celebrity]}33` }}
							onClick={() => props.toggleCeleb(d.celebrity)}
						>
							<img className="image" src={d.image} alt={d.celebrity} />
							<p key={key}>{d.celebrity}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default SideBarBottom;
