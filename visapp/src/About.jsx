function About(){
    return (
        <div className="AboutContainer">
            <div className="aboutPeople">
                About the site
            </div>

            <p className="mainText">
                This website is a digital tool to help users understand carbon dioxide (CO2) emissions, and the impact certain products and services
                have on the total amount of emissions. All emissions shown in the bar graph are consumption based emissions per capita, using data from
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