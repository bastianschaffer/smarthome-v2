import React, {useState, useEffect} from 'react'
import { postMsg } from '../App';
import ColorPicker from './ColorPicker';
import './ButtonSettings.css'






function ButtonSettings({buttonObj, setButtonList}) {
  const [animationList, setAnimationList] = useState([{}])
  const [selectedAnim, setSelectedAnim] = useState(buttonObj.selectedAnim);
  const [selectedColor, setSelectedColor] = useState(buttonObj.selectedColor)

  useEffect(() => {
    fetch("/animations").then(
        res => res.json()
    ).then(
      animationList => {
        setAnimationList(animationList)
        }
    )
  
  }, [])

  function handleSelectedAnimChange(event) {
    //setButtonList(bl => bl.map(b => (b ===buttonObj ? {...b, selectedAnim: newAnim} : b)))
    var newAnim = event.target.value;
    setSelectedAnim(newAnim);
    postMsg("selectAnimRuntime", {"animTitle" : newAnim});
  }
  
  function handleConfirmAnim(){
    postMsg("confirmAnim", {"animTitle" : selectedAnim});
    setButtonList(bl => bl.map(b => b === buttonObj ? {...b, openedSettings: false, selectedAnim: selectedAnim, selectedColor: selectedColor } : b));
  }


  function handleColorPickerUpdate(newColor){
    setSelectedColor(newColor);
    console.log("color change | " + newColor);
  }


  return (
    <div className="buttonSettingsContainer">
        
        <div className='title'>
            <h1> LED Strip 1 </h1>
        </div>
        <div className='body'>
          
          <select value={selectedAnim} onChange={handleSelectedAnimChange}> 
           
            <option value = {selectedAnim} >{selectedAnim}</option>

              {!(typeof animationList.animations === 'undefined') &&
                  animationList.animations.map((anim, i) =>(
                    anim.title !== selectedAnim && <option key={i} value = {anim.title} >{anim.title}</option>
                  ))
              
              }
          </select>
          {selectedAnim === "colorpicker" && <ColorPicker buttonObj={buttonObj} handleChange={handleColorPickerUpdate}></ColorPicker>}
          
        </div>
        <div className='footer'>
          <button className='cancelBtn' onClick={() => setButtonList(bl => bl.map(b => b === buttonObj ? {...b, openedSettings: false} : b))}>
            Cancel 
          </button>
          <button className='confirmBtn' onClick={() => handleConfirmAnim()}> Confirm </button>
        </div>
    </div>
    
  )
}

export default ButtonSettings