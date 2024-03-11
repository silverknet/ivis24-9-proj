import React, { useState } from 'react';

function About() {
    const [showLimitations, setShowLimitations] = useState(false);
  
    const toggleLimitations = () => {
      setShowLimitations(!showLimitations);
    };
  
    return (
      <div>
        <div className="TopSection">
            
          <div className="leftpane">
            <div className="aboutPeople">
              About the site
            </div>
            <div className= "aboutTextContainer">
            <p className="aboutMainText">
            This website is a digital tool to help users understand carbon dioxide (CO2) emissions, and the impact certain products and services
            have on the total amount of emissions. All emissions shown in the bar graph are consumption-based emissions per capita. All data comes from
            <a href="https://www.gapminder.org/"> Gapminder</a>, <a href="https://ourworldindata.org/"> OurWorldInData</a>, 
            and <a href="https://weareyard.com/"> WeAreYard</a>. Click below to see all data and where it came from!
            </p>
          </div>
          </div>

          <div className="righttpane">
            <div className="aboutPeople">
              Limitations
            </div>
            <div className= "aboutTextContainer">
            <p className="aboutMainText">
                <p>The data is gathered from different sources. There is therefore no guarantee that emissions correlate between datasets. What goes into each country's emissions should therefore only be considered estimates.</p>
                <p>There is also no way of calculating the exact impact of different systemic changes. For example, banning personal flights outright would likely lead to other problems, such as more emissions from people being forced to travel through energy inefficient means.</p>
                <p>This feature is intended to be used to better understand where emissions come from and how they can be reduced, not as a measure of what different changes would do for the world.</p>
            </p>
          </div>
          </div>
          </div>
  
          <div className="limitationsButtonContainer">
        <button onClick={toggleLimitations} className="limitationsButton">
            {showLimitations ? 'Hide Full Data Sources' : 'Show Full Data Sources'}
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
                <td><a href="http://gapm.io/dco2_consumption_historic">Gapminder</a> </td>
            </tr>
            <tr>
                <td>GDP per capita</td>
                <td><a href="http://gapm.io/dgdpcap_cppp">Gapminder</a> </td>
            </tr>
            <tr>
                <td>Population</td>
                <td><a href="http://gapm.io/dpop">Gapminder</a> </td>
            </tr>
            <tr>
                <td>Meat consumption per capita</td>
                <td><a href="https://ourworldindata.org/grapher/per-capita-meat-type?tab=table&country=CHN~USA~IND~ARG~PRT~ETH~JPN~GBR~BRA">OurWorldInData</a> </td>
            </tr>
            <tr>
                <td>Environmental impact of food</td>
                <td><a href="https://ourworldindata.org/environmental-impacts-of-food">OurWorldInData</a> </td>
            </tr>
            <tr>
                <td>Flight emissions, adjusted for tourism</td>
                <td><a href="https://ourworldindata.org/grapher/per-capita-co2-aviation-adjusted">OurWorldInData</a> </td>
            </tr>
            <tr>
                <td>Transporation emissions per capita</td>
                <td><a href="https://ourworldindata.org/grapher/per-capita-co2-transport">OurWorldInData</a> </td>
            </tr>
            <tr>
                <td>Celebrity emissions</td>
                <td><a href="https://weareyard.com/insights/worst-celebrity-private-jet-co2-emission-offenders">WeAreYard</a> </td>
            </tr>
        </table>
      </div>
    )}

  
        <div className="BottomSection">
          <div className="aboutPeople">
            This tool was made by
          </div>
          <div className="peopleDiv"><span className="aboutSpan">Amanda Hallstedt</span> <span className="aboutSpan">BILD</span></div>
          <div className="peopleDiv"><span className="aboutSpan">Dante Sangregorio</span> <span className="aboutSpan">BILD</span></div>
          <div className="peopleDiv"><span className="aboutSpan">Martin Håkansson</span> <span className="aboutSpan">BILD</span></div>
          <div className="peopleDiv"><span className="aboutSpan">Patrik Lundqvist</span> <span className="aboutSpan">BILD</span></div>
          <div className="peopleDiv"><span className="aboutSpan">Saga Jonasson</span> <span className="aboutSpan">BILD</span></div>
        </div>
      </div>
    );
  }
  
  export default About;
  
