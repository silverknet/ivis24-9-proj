import { useState } from "react";
import CountryDetailGraph from './CountryDetailGraph';

import noflag from "./assets/noflag.png";

// The messiest code you've ever seen
function SideBarMiddle(props) {
  const c = props.selectedCountry.country;
  var meatco2 = "";
  var meatPercent = 100;
  var flightco2 = "";
  var flightPercent = 100;
  var transportco2 = "";
  var transportPercent = 100;

  var meatBool = false;
  var flightBool = false;
  var transportBool = false;
  var showBool = true;
  

  if(props.meatData[c] !== undefined){
    meatco2 = props.meatData[c][0]*props.foodData["Poultry"] + props.meatData[c][1]*props.foodData["Beef (beef herd)"] + props.meatData[c][2]*props.foodData["Mutton"] + props.meatData[c][3]*props.foodData["Pork"] + props.meatData[c][5]*props.foodData["Fish (farmed)"];
    meatPercent = Math.round((meatco2*0.1)/props.selectedCountry["2022"])
    meatco2 = (meatco2*0.001).toFixed(3)
  }

  if(meatPercent< 100){
    meatBool = true;
  }

  if (props.flightData[c] !== undefined){
      flightco2 = props.flightData[c]
      flightPercent = Math.round((flightco2*0.1)/props.selectedCountry["2022"])
      flightco2 = (flightco2*0.001).toFixed(3)
  }

  if(flightPercent < 100){
    flightBool = true;
  }

  if (props.transportData[c] !== undefined){
      transportco2 = props.transportData[c]*1000
      transportPercent = Math.round((transportco2*0.1)/props.selectedCountry["2022"])
      transportco2 = (transportco2*0.001).toFixed(3)
  }

  if(transportPercent < 100){
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

 function colorBox(val){
  if(val == 0) return {color: '#edb4d4'};
  if(val == 1) return {color: '#99bfc4'};
  if(val == 2) {return {color: '#edac6f'};}
}

  return ( 
    <div className='MiddleContainer Container'>
      <div className="ElementComponent">
        <div className='PageHeader '>
          <h3 className="countryNameText">{props.selectedCountry.country.toUpperCase()}</h3>
          <p className="continentText">{props.selectedCountry.continent.toUpperCase()}</p>
        </div>
      </div>
      <div className="ElementComponent">
        <div className="flagElement">
        <img
            className="DetailsFlag"
            src={props.selectedCountry.Code ? `https://flagcdn.com/${props.selectedCountry.Code.toLowerCase()}.svg` : noflag}
            alt={c}
          />
          <div className="countryEmission">
            <div className="numberBox">
              <p className="emissionNumber">{props.selectedCountry['2022']}</p>
            </div>
            <p className="tc">t/c</p>
          </div>
        </div>
      </div>
      <div className="ElementComponent">
        <div className="infoRow"><h3>POPULATION |  </h3><h3 className="yellow">{props.selectedCountry['population_2022']}</h3></div>
        <div className="infoRow"><h3>GDP per capita |  </h3><h3 className="green">${props.selectedCountry['GDP_2022']}</h3></div>
      </div>
      <div className="ElementComponent">
        <CountryDetailGraph countryData={props.countryData} selectedCountry={props.selectedCountry}/>
      </div>
      {showBool &&(
      <div className="partEmissions">
        <h2 className="outOfThe">Out of the total Co2 emitted</h2>
        <div className="percentContainer">
          {meatBool &&(
          <div className="percentBox" >
            <h1 className="percentage" style={colorBox(0)}>{meatPercent}%</h1>
            <h3 className="comesFrom">comes from <br></br>meat consumption</h3>
            <h3 className="tons" style={colorBox(0)}>({meatco2} tons)</h3>
          </div>)}
          {!meatBool &&(
            <div className="dataFaultBox">
              <h2>Missing <br></br>data<br></br> for meat</h2>
            </div>
          )}
          {flightBool &&(
          <div className="percentBox" > 
            <h1 className="percentage" style={colorBox(1)}>{flightPercent}%</h1>
            <h3 className="comesFrom">comes from <br></br>flying</h3>
            <h3 className="tons" style={colorBox(1)}>({flightco2} tons)</h3>
          </div>)}
          {!flightBool &&(
            <div className="dataFaultBox">
              <h2>Missing <br></br>data<br></br> for flights</h2>
            </div>
          )}
          {transportBool && (
          <div className="percentBox">
            <h1 className="percentage" style={colorBox(2)}>{transportPercent}%</h1>
            <h3 className="comesFrom">comes from <br></br>other transport</h3>
            <h3 className="tons" style={colorBox(2)}>({transportco2} tons)</h3>
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
          <div className="dataFaultBox2">
            <h1>Insufficient data</h1>
          </div>
          <h2>(We can't accurately tell where these emissions come from. Sorry!)</h2>
        </div>
      )}
    </div>
  );
}

export default SideBarMiddle;
