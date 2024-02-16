import { useState } from 'react';

function SideBarMiddle(props) {
 
  return (
    <>
      <div className='PageHeader'>
        <h1>{props.selectedCountry.country}</h1>
        <img className='DetailsFlag' src={props.selectedCountry.Flag_image_url}/>
      </div>
      <div className='PageContent'>
      </div>
    </>
  );
}

export default SideBarMiddle;
