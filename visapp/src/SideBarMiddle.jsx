import { useState } from 'react';
import noflag from "./assets/noflag.png"

function SideBarMiddle(props) {
 function showFlag(){
  if(props.selectedCountry.Flag_image_url){
    return props.selectedCountry.Flag_image_url;
  }
  else{
    console.log("slay");
    return noflag;
  }
 }
  return ( 
    <>
      <div className='PageHeader'>
        <h1>{props.selectedCountry.country}</h1>
        <img className='DetailsFlag' src={showFlag()}/>
      </div>
      <div className='PageContent'>
      </div>
    </>
  );
}

export default SideBarMiddle;
