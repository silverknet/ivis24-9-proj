import React from 'react';

function SideBarTop({ continents, selectedContinents, handleToggleContinent, handleSelectAll, handleDeselectAll }) {
    return (
        <div>
            <div>
                <button onClick={handleSelectAll}>Select All</button>
                <button onClick={handleDeselectAll}>Deselect All</button>
            </div>
            {continents.map((continent) => (
                <div key={continent}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedContinents.includes(continent)}
                            onChange={() => handleToggleContinent(continent)}
                        />
                        {continent}
                    </label>
                </div>
            ))}
        </div>
    );
}

export default SideBarTop;
