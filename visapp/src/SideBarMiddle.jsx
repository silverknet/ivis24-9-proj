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
    <div className='MiddleContainer Container'>
      <div className="ElementComponent">
        <div className='PageHeader '>
          <span>
            {props.selectedCountry.country}
          </span>
          <img
            className="DetailsFlag"
            src={props.selectedCountry.Code ? `https://flagcdn.com/${props.selectedCountry.Code.toLowerCase()}.svg` : noflag}
            alt={props.selectedCountry.country}
          />
        </div>
        
      </div>
      <div className="ElementComponent">
        <h3>Continent: {props.selectedCountry.continent}</h3>
        <h3>Population: {props.selectedCountry['population_2022']}</h3>
        <h3>GDP per capita: {props.selectedCountry['GDP_2022']}</h3>
      </div>

      <div className="ElementComponent">
        <CountryDetailGraph countryData={props.countryData} selectedCountry={props.selectedCountry}/>
      </div>
    </div>
  );
}

export default SideBarMiddle;
