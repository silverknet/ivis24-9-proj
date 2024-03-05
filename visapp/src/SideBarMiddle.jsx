import { useState } from "react";
import noflag from "./assets/noflag.png";

function SideBarMiddle(props) {
	function showFlag() {
		if (props.selectedCountry.Flag_image_url) {
			return props.selectedCountry.Flag_image_url;
		} else {
			return noflag;
		}
	}
	return (
		<>
			<div className="PageHeader">
				<span>{props.selectedCountry.country}</span>
				<span>
					<img
						className="DetailsFlag"
						src={props.selectedCountry.Code ? `https://flagcdn.com/${props.selectedCountry.Code.toLowerCase()}.svg` : noflag}
						alt={props.selectedCountry.country}
					/>
				</span>
			</div>
			<div className="PageContent">Continent: {props.selectedCountry.continent}</div>
		</>
	);
}

export default SideBarMiddle;
