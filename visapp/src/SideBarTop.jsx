import { color } from 'd3';
import { useState } from 'react';

function SideBarTop(props) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        // Pass the search query to the parent component or another file
        props.handleSearch(event.target.value);
    };

    const handleToggle = (key) => {
        props.setActiveContinents(prevState => ({ ...prevState, [key]: !prevState[key] }));
    };

    const continentColors = {
        'Europe': '#8CB4D0',
        'Asia': '#F8CA86', 
        'Africa': '#B3A6D6', 
        'North America': '#C68B8B', 
        'South America': '#99BD8D', 
        'Oceania': '#81C8B3'
    };
    function continentColorer(col){
        if(col == "Europe") return {backgroundColor: continentColors['Europe']};
        if(col == "Asia") return {backgroundColor: continentColors['Asia']};
        if(col == "Africa") return {backgroundColor: continentColors['Africa']};
        if(col == "North America") return {backgroundColor: continentColors['North America']};
        if(col == "South America") return {backgroundColor: continentColors['South America']};
        return {backgroundColor: continentColors['Oceania']};
    }

    function showExplanation(){
        document.getElementById("explanationTip").style.display = "block"
    }

    return (
        <div className='TopContainer Container'>
            <div className="ElementComponent">
                <div className='toggleViewContainer'>
                    <h3 className='toggleStackedViewText'>Toggle stacked view</h3>
                    <label className="switch">
                        <input type="checkbox" checked={props.continentORstacked} onClick={() => props.toggleVisState(props.continentORstacked === 0 ? 1 : 0)}/>
                        <span className="slider round"></span>
                    </label>
                    <div style={{fontSize:"20px", textAlign:"right", fontWeight:"bold"}} >
                        <span onMouseOver={()=>{showExplanation()}} onMouseLeave={()=>{document.getElementById("explanationTip").style.display ="none"}}>?</span>
                    </div>
                </div>
                <div id="explanationTip" style={{display:"none"}}>
                    The stacked view shows the bars divided up into<br/>emission sectors instead of continents.<br/>For info on which color corresponds to<br/>which sector, see "Country" tab.
                </div>
            </div>
            <div className="ElementComponent">
                <h2>Filter by continent</h2>
                <div className='continentFilter'>
                    {Object.keys(props.activeContinents).map(key => (
                        <div key={key} className="continent-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={props.activeContinents[key]}
                                    onChange={() => handleToggle(key)}
                                    style={{filter: 'grayscale(1)'}}
                                />
                                <span className="continent-name" style={continentColorer(key)}>{key}</span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="ElementComponent">
                <h2>Search by country</h2>
                <div className='searchContainer'>
                    <input
                        type="text"
                        placeholder="Enter country name"
                        value={searchQuery}
                        onChange={handleSearch}
                        style={{ margin: '0 auto', display: 'block', width: '80%', fontSize:'14px'}} // Centering styles
                    />
                </div>
            </div>
            <div className="ElementComponent">
                <h2>Change Co2 emission range</h2>
                <div className='emissionFilter'>
                    <div className='filterSliderItem'>
                        <label>Minimum Co2/c: {props.filterRange.min}</label>
                        <input
                            style={{filter: 'grayscale(1)'}}
                            type="range"
                            min="0"
                            max="30"
                            step="0.01"
                            value={props.filterRange.min}
                            onChange={(e) =>
                                props.setFilterRange((prev) => ({ ...prev, min: parseFloat(Math.min(e.target.value, props.filterRange.max)) }))
                            }
                        />
                    </div>
                    <div className='filterSliderItem'>
                        <label>Maximum Co2/c: {props.filterRange.max}</label>
                        <input
                            style={{filter: 'grayscale(1)'}}
                            type="range"
                            min="0"
                            max="30" 
                            step="0.01"
                            value={props.filterRange.max}
                            onChange={(e) =>
                                props.setFilterRange((prev) => ({ ...prev, max: parseFloat(Math.max(e.target.value, props.filterRange.min)) }))
                            }
                        />
                    </div>
                </div>
            </div>
            <div className="ElementComponent">
                <button className="viewButton" tabIndex="0" onClick={() => props.setYMaxState(30)}>Reset Y-axis</button>
            </div>
            
        </div>
    );
}

export default SideBarTop;

