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

      {showBool &&(
      <div className="partEmissions">
        <h2>Out of these carbon emissions:</h2>
        <div className="percentContainer">
          {meatBool &&(
          <div className="percentBox">
            <h1>{meatPercent}%</h1>
            <h3>comes from <br></br>meat consumption</h3>
            <h3>({meatco2} tons)</h3>
          </div>)}
          {!meatBool &&(
            <div className="dataFaultBox">
              <h2>Missing <br></br>data<br></br> for meat</h2>
            </div>
          )}
          {flightBool &&(
          <div className="percentBox">
            <h1>{flightPercent}%</h1>
            <h3>comes from <br></br>flying</h3>
            <h3>({flightco2} tons)</h3>
          </div>)}
          {!flightBool &&(
            <div className="dataFaultBox">
              <h2>Missing <br></br>data<br></br> for flights</h2>
            </div>
          )}
          {transportBool && (
          <div className="percentBox">
            <h1>{transportPercent}%</h1>
            <h3>comes from <br></br>other transport</h3>
            <h3>({transportco2} tons)</h3>
          </div>)}
          {!transportBool &&(
            <div className="dataFaultBox">
              <h2>Missing <br></br>data<br></br> for other <br></br>transport</h2>
            </div>
          )}
        </div>
      </div>)}

      {!showBool&&(
        <div className="partEmissions">
          <div className="dataFaultBox">
            <h1>Insufficient data</h1>
          </div>
          <h2>(We can't accurately tell where these emissions come from. Sorry!)</h2>
        </div>
      )}
    </div>
  );
}

export default SideBarMiddle;
