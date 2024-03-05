import { useState } from "react";
import CountryDetailGraph from './CountryDetailGraph';

import noflag from "./assets/noflag.png";

function SideBarMiddle(props) {
 function showFlag(){
  if(props.selectedCountry.Flag_image_url){
    return props.selectedCountry.Flag_image_url;
  }
  else{
    return noflag;
  }
 }
  return ( 
    <>
      <div className='PageHeader'>
        <span>{props.selectedCountry.country}</span>
        <span>
			<img
				className="DetailsFlag"
				src={props.selectedCountry.Code ? `https://flagcdn.com/${props.selectedCountry.Code.toLowerCase()}.svg` : noflag}
				alt={props.selectedCountry.country}
			/>
		</span>
      </div>
      <div className='PageContent'>
		<h3>Continent: {props.selectedCountry.continent}</h3>
		<CountryDetailGraph countryData={props.countryData} selectedCountry={props.selectedCountry}/>
      </div>
    </>
  );
}

export default SideBarMiddle;
