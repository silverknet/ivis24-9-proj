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
  
    return (
        <div className='TopContainer Container'>
            <div className="ElementComponent">
                <div style={{backgroundColor:'#FFFFFF', color:'#000000', borderStyle:'solid', padding:'4px', borderRadius:'5px', borderColor:'#9c9c9c'}} onClick={() => props.toggleVisState(0)}>Show Continents</div>
                <div style={{backgroundColor:'#FFFFFF', color:'#000000', borderStyle:'solid', padding:'4px', borderRadius:'5px', borderColor:'#9c9c9c'}} onClick={() => props.toggleVisState(1)}>Show Stacks</div>
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
            
        </div>
    );
}

export default SideBarTop;

