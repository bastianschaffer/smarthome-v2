import React, {useState} from 'react'
//import { btnTypes } from '../App';
import { postMsg } from '../App';
import ButtonSettings from './ButtonSettings';

var pressingButton = false;
var pressedButton = false;
var intervalId = null;


function startBtnTouch(setOpenSettings, btnType){
  pressingButton = true;

  intervalId = setInterval(() => {
    if(pressingButton && btnType == "led"){
      console.log("press event");
      setOpenSettings(true);
      pressedButton = true;      
    }
  }, 750);
  
}

function endBtnTouch(btnTitle){
  pressingButton = false;
  if(!pressedButton){
    console.log("click event");
    postMsg(btnTitle);
  }
  pressedButton = false;
  clearInterval(intervalId);
}


function SmartButton({_title, _btnType}) {
  const [openSettings, setOpenSettings] = useState(false);
    

  return (
    <div className="smartButtonBg">

      <button className='smartBtn'  onPointerDown={() => startBtnTouch(setOpenSettings, _btnType)} onPointerUp={() => endBtnTouch(_title)}>{_title}</button>
                   
      {openSettings && <ButtonSettings setOpenSettings={setOpenSettings}/>}
    </div>
  )
}

export default SmartButton