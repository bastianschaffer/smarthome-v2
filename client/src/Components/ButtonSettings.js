import React, {useState, useEffect} from 'react'
import { postMsg } from '../App';
import ColorPicker from './ColorPicker';
import './ButtonSettings.css'



function handleSelectedAnimChange(buttonObj, setButtonList, newAnim) {
  //setSelectedAnim(newAnim);
  setButtonList(bl => bl.map(b => (b ===buttonObj ? {...b, selectedAnim: newAnim} : b)))
  postMsg("selectAnimRuntime", {"animTitle" : newAnim});
}

function handleConfirmAnim(selectedAnim, buttonObj, setButtonList){
  postMsg("confirmAnim", {"animTitle" : selectedAnim});
  setButtonList(bl => bl.map(b => b === buttonObj ? {...b, openedSettings: false} : b));
}


function ButtonSettings({buttonObj, setButtonList}) {
  const [animationList, setAnimationList] = useState([{}])
  //const [selectedAnim, setSelectedAnim] = useState(loadedSelectedAnim)


  useEffect(() => {
    fetch("/animations").then(
        res => res.json()
    ).then(
      animationList => {
        setAnimationList(animationList)
        }
    )
  
  }, [])


  function handleColorPickerUpdate(newColor){
    console.log("color change | " + newColor.h + ", " + newColor.v)
  }

  const selectedAnim = buttonObj.selectedAnim;

  return (
    <div className="buttonSettingsContainer">
        
        <div className='title'>
            <h1> LED Strip 1 </h1>
        </div>
        <div className='body'>
          
          <select value={selectedAnim} onChange={e => handleSelectedAnimChange(buttonObj, setButtonList, e.target.value)}> 
           
            <option value = {selectedAnim} >{selectedAnim}</option>

              {!(typeof animationList.animations === 'undefined') &&
                  animationList.animations.map((anim, i) =>(
                    anim.title !== selectedAnim && <option key={i} value = {anim.title} >{anim.title}</option>
                  ))
              
              }
          </select>
          {selectedAnim === "colorpicker" && <ColorPicker handleChange={handleColorPickerUpdate}></ColorPicker>}
          
        </div>
        <div className='footer'>
          <button onClick={() => setButtonList(bl => bl.map(b => b === buttonObj ? {...b, openedSettings: false} : b))}>
            Cancel 
          </button>
          <button onClick={() => handleConfirmAnim(selectedAnim, buttonObj, setButtonList)}> Confirm </button>
        </div>
    </div>
    
  )
}

export default ButtonSettings