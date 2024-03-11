import React, { useState } from 'react';

function About() {
  const [showLimitations, setShowLimitations] = useState(false);

  const toggleLimitations = () => {
    setShowLimitations(!showLimitations);
  };

  return (
    <div className="AboutContainer">
      <div className="aboutPeople">
        About the site
      </div>

        {/* Button to toggle limitations */}
    <div className="limitationsButtonContainer">
        <button onClick={toggleLimitations} className="limitationsButton">
            {showLimitations ? 'Hide Limitations' : 'Show Limitations'}
        </button>
    </div>



      {/* Display the limitations if showLimitations is true */}
      {showLimitations && (
        <div className="limitationsBox">
          <p>This is a placeholder text for the limitations box. You can replace it with your content.</p>
          <p>Data from for the Co2 Emisions per capita is derived form data colected by gapminder</p>
          <p>this data is collected by...</p>
          <p>Data that affects restrictions are from...</p>
          <p></p>
          <p>This data can be used to get estimates the instant effect certain decions would have. It can not factor in further impacts such decisons would have, for example, if baning flights would lead to an increse in other forms of traveling</p>
          <p>This feature should be used to gauge how impactful centrian emisioons can be not be used to make decions or shape opnions on policy</p>
      
        </div>
      )}

      <p className="mainText">
        This website is a digital tool to help users understand carbon dioxide (CO2) emissions, and the impact certain products and services
        have on the total amount of emissions. All emissions shown in the bar graph are consumption-based emissions per capita, using data from
        <a href="http://gapm.io/dco2_consumption_historic">Gapminder.</a> The estimates for the impact of specific products or sectors are based
        on data from <a href="">Link1</a>, <a href="">Link2</a>, <a href="">Link3</a> and <a href="">Link4</a>.
        Celebrity estimates are based on data from <a href="">Link5</a>.
      </p>
      <p className="mainText">
        We hope this tool can help you better understand the impact of your personal choices, as well as what it takes for us to reach the global climate goal
        of keeping temperature rise below 1.5C.
      </p>

      <div className="aboutPeople">
        This tool was made by
      </div>
      <div className="peopleDiv"><span className="aboutSpan">Amanda Hallstedt</span> <span className="aboutSpan">BILD</span></div>
      <div className="peopleDiv"><span className="aboutSpan">Dante Sangregorio</span> <span className="aboutSpan">BILD</span></div>
      <div className="peopleDiv"><span className="aboutSpan">Martin Håkansson</span> <span className="aboutSpan">BILD</span></div>
      <div className="peopleDiv"><span className="aboutSpan">Patrik Lundqvist</span> <span className="aboutSpan">BILD</span></div>
      <div className="peopleDiv"><span className="aboutSpan">Saga Jonasson</span> <span className="aboutSpan">BILD</span></div>
    </div>
  );
}

export default About;
