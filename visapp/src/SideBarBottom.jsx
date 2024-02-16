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
    <>
      {Object.keys(checkBoxData).map(key => (
        <label key={key}>
          <input
            type="checkbox"
            onChange={() => handleToggle(key)}
            name={key}
            checked={props.policyState[key]}
          />
          {checkBoxData[key]}
        </label>
      ))}
    </>
  );
}

export default SideBarBottom;
