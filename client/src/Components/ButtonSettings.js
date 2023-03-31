import React, {useState, useEffect} from 'react'
import { postMsg } from '../App';
import ColorPicker from './ColorPicker';


function handleSelectedAnimChange(setSelectedAnim, newAnim) {
  setSelectedAnim(newAnim);
  postMsg("selectAnimRuntime", {"animTitle" : newAnim});
}

function handleConfirmAnim(selectedAnim, setOpenSettings){
  postMsg("confirmAnim", {"animTitle" : selectedAnim});
  setOpenSettings(false);
}




function ButtonSettings({setOpenSettings, loadedSelectedAnim}) {
  const [animationList, setAnimationList] = useState([{}])
  const [selectedAnim, setSelectedAnim] = useState(loadedSelectedAnim)


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


  return (
    <div className="modalContainer">
              
        <button onClick={() => setOpenSettings(false)}> X </button>
        <div className='title'>
            <h1> LED Strip 1 </h1>
        </div>
        <div className='body'>
          
          <select value={selectedAnim} onChange={e => handleSelectedAnimChange(setSelectedAnim, e.target.value)}> 
            <option value = {selectedAnim} >{selectedAnim}</option>
              {!(typeof animationList.animations === 'undefined') &&
                  animationList.animations.map((anim, i) =>(
                    anim.title !== selectedAnim && <option key={i} value = {anim.title} >{anim.title}</option>
                  ))
              
              }
          </select>

          {
            
          }
          {selectedAnim == "colorpicker" && <ColorPicker handleChange={handleColorPickerUpdate}></ColorPicker>}
          

          
        </div>
        <div className='footer'>
        <button onClick={() => setOpenSettings(false)}> Close </button>
        <button onClick={() => handleConfirmAnim(selectedAnim, setOpenSettings)}> Confirm </button>
        </div>
    </div>
    
  )
}

export default ButtonSettings