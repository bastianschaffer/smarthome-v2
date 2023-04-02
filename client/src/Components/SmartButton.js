import React, {useState} from 'react'
//import { btnTypes } from '../App';
import { postMsg } from '../App';
import ButtonSettings from './ButtonSettings';
import './SmartButton.css'
import PresetSettings from './PresetSettings';


var pressingButton = false;
var pressedButton = false;
var lastInterval = null;


function startBtnTouch(buttonObj, setButtonList){
  pressingButton = true;

  lastInterval = setInterval(() => {
    if(pressingButton && buttonObj.type !== "light"){
      setButtonList(bl => bl.map(b => 
        ( b === buttonObj ? {...b, openedSettings: true} : {...b, openedSettings: false})))

      pressedButton = true; 
      clearInterval(lastInterval);  
    }
  }, 750);
  
}

function handleClick(buttonObj, setButtonList){
  if(buttonObj.type === "preset"){
    if(buttonObj.toggled){
      setButtonList(bl => bl.map(b => ({...b, toggled: false})));
    }
    else{
      setButtonList(bl => bl.map(b => 
        ((buttonObj.toggledButtons.includes(b.title) || buttonObj === b) ?  
          {...b, toggled: true} : {...b, toggled: false})));
    }
  }
  else{
    setButtonList(bl => bl.map(b => {
      if(b === buttonObj){
        b.toggled = !b.toggled;
      }else if(b.type === "preset"){
        b.toggled = false;
      }
      return b;
    }));
  }  
  postMsg("click", {"btnTitle: " : buttonObj.title});
}

function endBtnTouch(buttonObj, setButtonList){
  pressingButton = false;
  if(!pressedButton){
    handleClick(buttonObj, setButtonList);
  }
  pressedButton = false;
  clearInterval(lastInterval);
}

function showSettings(buttonObj, setButtonList){
  if(buttonObj.type === "led"){
    return <ButtonSettings buttonObj={buttonObj} setButtonList={setButtonList} />;
  }else if(buttonObj.type === "preset"){
    return <PresetSettings buttonObj={buttonObj} setButtonList={setButtonList} />
  }
}

function SmartButton({buttonObj, setButtonList}) {
    

  return (
    <div className="smartButtonMain">

      <button className='smartBtn' onPointerDown={() => startBtnTouch(buttonObj, setButtonList)} 
              onPointerUp={() => endBtnTouch(buttonObj, setButtonList)}>{buttonObj.title}
      </button>
                   
      {buttonObj.toggled && <div> ... is toggled</div>}
      {buttonObj.openedSettings && showSettings(buttonObj, setButtonList)}

    </div>
  )
}

export default SmartButton