import React, {useEffect, useState} from 'react'
import Wheel from '@uiw/react-color-wheel'
import './ColorPicker.css'
import { hexToHsva, hsvaToHex} from '@uiw/color-convert';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';



function ColorPicker({buttonObj, handleChange}) {
    const [value, setValue] = useState(hexToHsva(buttonObj.selectedColor).v);

    const [wheelColor, setWheelColor] = useState(hsvaToHex({...hexToHsva(buttonObj.selectedColor), v: 100}));

    function handleValueChange(newVal){
      //var newVal = event.target.value
      var newColor = hsvaToHex({...hexToHsva(wheelColor), v: newVal});
      
      setValue(newVal);
      handleChange(newColor);
  }

  const sliderBackground ={
    width: "200px",
    background:  ("linear-gradient(90deg, #000000,"+ wheelColor + " )"), 
    marginTop: "10px",
    borderStyle: "solid",
    borderColor: "rgba(255, 255, 255, 1)",
    borderRadius: "5px",
    borderWidth: "1px"
  }
  
  return (
    <div  className='mainContainer' >ColorPicker

      {console.log("init color: " + buttonObj.selectedColor.h+ ", " + buttonObj.selectedColor.v) }
    <Wheel className="colorWheel"
      color={wheelColor}
      onChange={(color) => {
        handleChange(color.hex);
        setWheelColor(color.hex);
      }}
    />

    <div className="sliderContainer" style={sliderBackground}>
        {/*<input  className="valueSlider" type="range" min={1} max={100}  value={value} onChange={handleValueChange}  />*/}
        
        <Slider
          
          onChange={(nextValues) => {
            console.log('Change:', nextValues);
            handleValueChange(nextValues);
          }}
          

          min={0}
          max={100}
          defaultValue={value}
          step={1}

          railStyle={{ backgroundColor: 'rgba(255, 0, 0, 0)' }}
          trackStyle={{ backgroundColor: 'rgba(0, 255, 0, 0)' }}
          handleStyle={{
          borderColor: 'rgba(255, 255, 255, 1)',
          height: 28,
          width: 28,
          marginTop: "-12px",
          opacity: 1,
          backgroundColor: hsvaToHex({...hexToHsva(wheelColor), v: value}),
          boxShadow: "0px 2px 2px rgba(0, 0, 0, 0)"
        }}
        />

    </div>

    


    </div>
    
  )
}

export default ColorPicker