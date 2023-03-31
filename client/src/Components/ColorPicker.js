import React, {useEffect, useState} from 'react'
import Wheel from '@uiw/react-color-wheel'
import './ColorPicker.css'


function handleValueChange({setValue, hsva, setHsva, handleChange}, newVal){
    hsva.v = newVal;
    var newColor = { h: hsva.h, s: hsva.s, v: newVal, a: hsva.a};
    setHsva(newColor);
    setValue(newVal);
    handleChange(newColor);
}

function ColorPicker({handleChange}) {
    const [value, setValue] = useState(100);

    const [hsva, setHsva] = useState({ h: 0, s: 0, v: 100, a: 0 });
    

  return (
    <div  >ColorPicker

    <Wheel className="colorWheel"
      color={hsva}
      onChange={(color) => {
        handleChange(color.hsva);
        setHsva(color.hsva);
      }}
    />

    <div className="slidecontainer">
        <input type="range" min={1} max={100}  value={value} onChange={(v) => handleValueChange({setValue, hsva, setHsva, handleChange}, v.target.value)}/>
    </div>

    


    </div>
    
  )
}

export default ColorPicker