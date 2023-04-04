import React, {useState} from 'react'
//import { btnTypes } from '../App';
import { postMsg } from '../App';
import ButtonSettings from './ButtonSettings';
import './SmartButton.css'
import PresetSettings from './PresetSettings';


var pressingButton = false;
var pressedButton = false;
var lastInterval = null;



//color: #f07474


function SmartButton({buttonObj, setButtonList}) {

  function startBtnTouch(){
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
  
  function handleClick(){
    if(buttonObj.type === "preset"){
      if(buttonObj.toggled){
        setButtonList(bl => bl.map(b => ({...b, toggled: false})));
      }
      else{
        setButtonList(bl => bl.map(b => {
          var tb = buttonObj.toggledButtons.find(x => x.title === b.title);
          return tb !== undefined ? tb : (b.title === buttonObj.title ? {...b, toggled: true} : {...b, toggled: false})
        }));
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
    postMsg("click", {"btnTitle" : buttonObj.title});
  }
  
  function endBtnTouch(){
    pressingButton = false;
    if(!pressedButton){
      handleClick(buttonObj, setButtonList);
    }
    pressedButton = false;
    clearInterval(lastInterval);
  }
  
  function showSettings(){
    if(buttonObj.type === "led"){
      return <ButtonSettings buttonObj={buttonObj} setButtonList={setButtonList} />;
    }else if(buttonObj.type === "preset"){
      return <PresetSettings buttonObj={buttonObj} setButtonList={setButtonList} />
    }
  }
    
  const btnColor = {
    color: buttonObj.toggled ?  "rgb(255, 172, 111)" : "#ffffff",
    boxShadow : buttonObj.toggled ?  "rgba(255, 158, 87, 0.8) 0px 0px 20px" : "none"
  }
  ;
  
  return (
    <div className="smartButtonMain">

      <button className={buttonObj.toggled ? 'toggled' : "" }  onPointerDown={() => startBtnTouch()} 
              onPointerUp={() => endBtnTouch()}>{buttonObj.title}
      </button>
                   
      {buttonObj.openedSettings && showSettings()}

    </div>
  )
}

export default SmartButton