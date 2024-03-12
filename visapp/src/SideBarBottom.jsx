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

	return (
		<div className="BottomContainer Container">
			<div className="ElementComponent">
				<h1>Apply restrictions</h1>
			</div>
			<div className="ElementComponent">
				{Object.keys(checkBoxData).map((key) => (
					<label key={key}>
						<input type="checkbox" onChange={() => handleToggle(key)} name={key} checked={props.policyState[key]} className="checkboxColor" />
						<span className="checkBoxLabel">{checkBoxData[key]}</span>
					</label>
				))}
			</div>
			<div className="ElementComponent">
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
