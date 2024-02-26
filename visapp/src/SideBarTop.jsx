import React, { useState } from 'react';

function SideBarTop({ setContinentFilter }) {
  const [selectedContinent, setSelectedContinent] = useState('All');

  const handleContinentChange = (event) => {
    setSelectedContinent(event.target.value);
    setContinentFilter(event.target.value);
    console.log(selectedContinent)
  };

  return (
    <div className="sidebar-top">
      <h2>Filter by Continent</h2>
      <select value={selectedContinent} onChange={handleContinentChange}>
        <option value="All">All Continents</option>
        <option value="Africa">Africa</option>
        <option value="Asia">Asia</option>
        <option value="Europe">Europe</option>
        <option value="North America">North America</option>
        <option value="Oceania">Oceania</option>
        <option value="South America">South America</option>
      </select>
    </div>
  );
}

export default SideBarTop;


