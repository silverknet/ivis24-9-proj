import { useState } from 'react';

function SideBarTop({ continents, selectedContinents, handleToggleContinent, handleSelectAll, handleDeselectAll }) {
    return (
        <div className="sidebar-top-container">
            <div className="button-group">
                <button className="select-button" onClick={handleSelectAll}>Select All</button>
                <button className="select-button" onClick={handleDeselectAll}>Deselect All</button>
            </div>
            {continents.map((continent) => (
                <div key={continent} className="continent-item">
                    <label>
                        <input
                            type="checkbox"
                            className='checkboxColor'
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
