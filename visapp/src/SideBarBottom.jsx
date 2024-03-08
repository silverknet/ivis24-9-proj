import { useState } from 'react';

const checkBoxData = {
  meat: "Remove meat consumption",
  flight: "Remove flying",
  electric: "Only electric cars"
};

function SideBarBottom(props) {

  const handleToggle = (key) => {
    props.setPolicyState(prevState => ({ ...prevState, [key]: !prevState[key] }));
  };

  return (
    <div className='BottomContainer Container'>
      <div className="ElementComponent">
        <h1>Apply restrictions</h1>
      </div>
      <div className='ElementComponent'>
      {Object.keys(checkBoxData).map(key => (
        <label key={key}>
          <input
            type="checkbox"
            onChange={() => handleToggle(key)}
            name={key}
            checked={props.policyState[key]}
            className='checkboxColor'
          />
          {checkBoxData[key]}
        </label>
      ))}
      </div>
    </div>
  );
}

export default SideBarBottom;
