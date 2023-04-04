import React, {useState, useEffect} from 'react'
import { postMsg } from '../App';
import ColorPicker from './ColorPicker';
import './ButtonSettings.css'
import Select from 'react-select'




function ButtonSettings({buttonObj, setButtonList}) {
  const [animationList, setAnimationList] = useState([{}])
  const [selectedAnim, setSelectedAnim] = useState({value: buttonObj.selectedAnim, label: buttonObj.selectedAnim});
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

  function handleSelectedAnimChange(newObj) {
    //setButtonList(bl => bl.map(b => (b ===buttonObj ? {...b, selectedAnim: newAnim} : b)))
    //var newAnim = event.target.value;
    setSelectedAnim(newObj);
    postMsg("selectAnimRuntime", {"animTitle" : newObj.value});
  }
  
  function handleConfirmAnim(){
    postMsg("confirmAnim", {"animTitle" : selectedAnim.value});
    setButtonList(bl => bl.map(b => b === buttonObj ? {...b, openedSettings: false, selectedAnim: selectedAnim.value, selectedColor: selectedColor } : b));
  }


  function handleColorPickerUpdate(newColor){
    setSelectedColor(newColor);
    console.log("color change | " + newColor);
  }


  return (
    <div className="buttonSettingsContainer">
        
        <div className='title'>
            <h1> {buttonObj.title} </h1>
        </div>
        <div className='animSelectionDiv'>
          {console.log("renering selected anim: " + selectedAnim.value)}
          { !(typeof animationList.animations === 'undefined') &&
          <Select className='animSelect' isSearchable={false} name="test" value={selectedAnim}  defaultValue={selectedAnim} 
            onChange={handleSelectedAnimChange} options={animationList.animations.map(a => ({value: a.title, label: a.title}))}
            styles={{option: (baseStyles, state) => ({
              ...baseStyles,
              background: "rgba(1, 1, 15, 0.2)",
              color: "white",
              textAlign: "center",
              width: "200px",
              borderRadius: "10px",
              "&:hover": {
                boxShadow: '0 0 10px rgba(100, 100, 100, 0.5)' 
              }
            }),
            control: (baseStyles, state) => ({
              ...baseStyles,
              background: "rgba(1, 1, 15, 0.8)",
              color: "white",
              width: "200px",
              marginBottom: "100px",
              borderColor: "rgba(0, 0, 0, 0)",
              boxShadow: "none",
              '&:hover': {
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)' 
             }
            }),
            menu: (baseStyles, state) => ({
              ...baseStyles,
              marginTop: "0px",
              background: "rgba(1, 1, 15, 0.9)",
              borderColor: "white",
              borderWidth: "10px",
              backdropFilter: "blur(10px)"
            }),
            singleValue: (baseStyles, state) => ({
              ...baseStyles,
              color: "white"
            })
          }}
          menuPortalTarget={document.body}
          menuPosition={'fixed'} 
          />
          }
          
          
          {selectedAnim.value === "colorpicker" && <ColorPicker className="colorPicker" buttonObj={buttonObj} handleChange={handleColorPickerUpdate}></ColorPicker>}
          
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