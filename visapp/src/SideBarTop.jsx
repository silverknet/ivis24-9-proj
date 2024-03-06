// Inside the SideBarTop component file

import React, { useState } from 'react';

function SideBarTop({ continents, selectedContinents, handleToggleContinent, handleSelectAll, handleDeselectAll, handleSearch }) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleConfirmSearch = () => {
        handleSearch(searchQuery);
    };

    return (
        <div className="sidebar-top-container">
            <div className="button-group">
                <button className="select-button" onClick={handleSelectAll}>Select All</button>
                <button className="select-button" onClick={handleDeselectAll}>Deselect All</button>
            </div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search countries..."
                    value={searchQuery}
                    onChange={handleChange}
                />
                <button className="confirm-button" onClick={handleConfirmSearch}>Search</button>
            </div>
            {continents.map((continent) => (
                <div key={continent} className="continent-item">
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedContinents.includes(continent)}
                            onChange={() => handleToggleContinent(continent)}
                        />
                        <span className="continent-name">{continent}</span>
                    </label>
                </div>
            ))}
        </div>
    );
}

export default SideBarTop;



