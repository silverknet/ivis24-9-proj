

function HowToUse(){
    return (
        <div className="HowToUseContainer">
            <div className="aboutPeople">How to use</div>
            <div className="howToTextContainer">
                <p className="mainText">
                    This tool is hopefully pretty intutive, but here are some tips to get you going!
                </p>
                <p className="mainText">
                    Pick a country or continent under the tab "Filter". By default we show Europe and North America, but you can pick whatever you like!
                    The bar graphs that show up tells you the CO2 emissions per capita for each country, the flags indicate which country you're looking at
                    but if you want more information then press one of the bars! The country highlighted in grey is your currently selected country, under
                    the tab "Country Info" you can read more about that specific country and see their emission statistic over time.
                </p>
                <p className="mainText">
                    The big feature of this tool is your ability to "play god", i.e. the possibility to place bans and restrictions on consumption behaviours. Under the tab "Restrictions"
                    you'll find some toggle switches, where you can decide to put an end to things like meat consumption or commersial air travel. The effects
                    of your choices will be applied to the bar graph, for an easy overview of what it would take for us to reach the 1.5C goal.
                </p>
            </div>
            <div className="aboutPeople">Demo</div>
            <div className="video">
                 <a href="https://youtu.be/TAwIMjSiC20">Youtube Link</a>
                 <div id="video">
                 <iframe title='Demo vid' width='640' height='390' src='https://youtube.com/embed/TAwIMjSiC20' frameborder='0' allowFullScreen></iframe>
                 </div>
                
            </div>
        </div>
    );
}
export default HowToUse;