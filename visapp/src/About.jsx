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
              have on the total amount of emissions. All emissions shown in the bar graph are consumption-based emissions per capita, using data from
              <a href="http://gapm.io/dco2_consumption_historic">Gapminder.</a> The estimates for the impact of specific products or sectors are based
              on data from <a href="">Link1</a>, <a href="">Link2</a>, <a href="">Link3</a> and <a href="">Link4</a>.
              Celebrity estimates are based on data from <a href="">Link5</a>.
            </p>
          </div>
          </div>

          <div className="righttpane">
            <div className="aboutPeople">
              limitations
            </div>
            <div className= "aboutTextContainer">
            <p className="aboutMainText">
                Data from for the Co2 Emisions per capita is derived form data colected by gapminder
                <p>this data is collected by...</p>
                <p>Data that affects restrictions are from...</p>
                <p></p>
                <p>This data can be used to get estimates the instant effect certain decions would have. It can not factor in further impacts such decisons would have, for example, if baning flights would lead to an increse in other forms of traveling</p>
                <p>This feature should be used to gauge how impactful centrian emisioons can be not be used to make decions or shape opnions on policy</p>
            </p>
          </div>
          </div>
          </div>
  

  
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
  
