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
  
    return (
        <div className='TopContainer'>
            <h2>Filter by continent</h2>
            <div className='continentFilter'>
                {Object.keys(props.activeContinents).map(key => (
                    <div key={key} className="continent-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={props.activeContinents[key]}
                                onChange={() => handleToggle(key)}
                            />
                            <span className="continent-name">{key}</span>
                        </label>
                    </div>
                ))}
            </div>
            <h2>Search by country</h2>
            <div className='searchContainer'>
                <input
                    type="text"
                    placeholder="Enter country name"
                    value={searchQuery}
                    onChange={handleSearch}
                    style={{ margin: '0 auto', display: 'block', width: '80%' }} // Centering styles
                />
            </div>
            <h2>Change Co2 emission range</h2>
            <div className='emissionFilter'>
            <div className='filterSliderItem'>
                    <label>Maximum Co2/c: {props.filterRange.max}</label>
                    <input
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
    );
}

export default SideBarTop;

