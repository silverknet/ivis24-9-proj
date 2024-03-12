import { useState } from "react";
import CountryDetailGraph from './CountryDetailGraph';

import noflag from "./assets/noflag.png";

// The messiest code you've ever seen
function SideBarMiddle(props) {
  const c = props.selectedCountry.country;
  var meatco2 = "";
  var meatPercent = 0;
  var flightco2 = "";
  var flightPercent = 0;
  var transportco2 = "";
  var transportPercent = 0;

  var meatBool = false;
  var flightBool = false;
  var transportBool = false;
  var showBool = true;

  if(props.meatData[c] !== undefined){
    meatco2 = props.meatData[c][0]*props.foodData["Poultry"] + props.meatData[c][1]*props.foodData["Beef (beef herd)"] + props.meatData[c][2]*props.foodData["Mutton"] + props.meatData[c][3]*props.foodData["Pork"] + props.meatData[c][5]*props.foodData["Fish (farmed)"];
    meatPercent = Math.round((meatco2*0.1)/props.selectedCountry["2022"])
    meatco2 = (meatco2*0.001).toFixed(3)
  }

  if(meatPercent != "" && meatPercent< 100){
    meatBool = true;
  }

  if (props.flightData[c] !== undefined){
      flightco2 = props.flightData[c]
      flightPercent = Math.round((flightco2*0.1)/props.selectedCountry["2022"])
      flightco2 = (flightco2*0.001).toFixed(3)
  }

  if(flightPercent != "" && flightPercent < 100){
    flightBool = true;
  }

  if (props.transportData[c] !== undefined){
      transportco2 = props.transportData[c]*1000
      transportPercent = Math.round((transportco2*0.1)/props.selectedCountry["2022"])
      transportco2 = (transportco2*0.001).toFixed(3)
  }

  if(transportPercent != "" && transportPercent < 100){
    transportBool = true;
  }

  if (meatPercent +flightPercent+transportPercent>100){
    showBool = false;
  }

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
            {c}
          </span>
          <img
            className="DetailsFlag"
            src={props.selectedCountry.Code ? `https://flagcdn.com/${props.selectedCountry.Code.toLowerCase()}.svg` : noflag}
            alt={c}
          />
        </div>
        
      </div>
      <div className="ElementComponent">
        <h3>Continent: {props.selectedCountry.continent}</h3>
        <h3>Population: {props.selectedCountry['population_2022']}</h3>
        <h3>GDP per capita: ${props.selectedCountry['GDP_2022']}</h3>
      </div>

      <div className="ElementComponent">
        <CountryDetailGraph countryData={props.countryData} selectedCountry={props.selectedCountry}/>
      </div>

      {showBool &&(
      <div className="partEmissions">
        <h2>Out of these carbon emissions:</h2>
        <div className="percentContainer">
          {meatBool &&(
          <div className="meatBox">
          <div className="percentBox">
            <h1>{meatPercent}%</h1>
            <h3>comes from <br></br>meat consumption</h3>
            <h3>({meatco2} tons)</h3>
            </div>
          </div>)}
          {!meatBool &&(
            <div className="dataFaultBox">
              <h2>Missing <br></br>data<br></br> for meat</h2>
            </div>
          )}
          {flightBool &&(
            <div className="flightBox">
              <div className="percentBox">
            <h1>{flightPercent}%</h1>
            <h3>comes from <br></br>flying</h3>
            <h3>({flightco2} tons)</h3>
            </div>
          </div>)}
          {!flightBool &&(
            <div className="dataFaultBox">
              <h2>Missing <br></br>data<br></br> for flights</h2>
            </div>
          )}
          {transportBool && (
          <div className="transportBox">
          <div className="percentBox">
            <h1>{transportPercent}%</h1>
            <h3>comes from <br></br>other transport</h3>
            <h3>({transportco2} tons)</h3>
            </div>
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
