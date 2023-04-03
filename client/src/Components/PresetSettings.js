import React, {useState} from 'react'
import './ButtonSettings'


function PresetSettings({buttonObj, setButtonList}) {
  const [inputName, setInputName] = useState(buttonObj.title);

  function handleTitleChange(event) {    
    setInputName(event.target.value); 
   }

   function handleConfirm(){
    setButtonList(bl => bl.map(b => b === buttonObj ? {...b, openedSettings: false, title: inputName} : b))
   }

  return (
    <div className='buttonSettingsContainer'>
      <h3>Settings</h3>
      <input type="text" value={inputName} onChange={handleTitleChange} />
        {/* later maybe add timing functionality and alarm synchronization here */}
        <div className='bottomButtons'> 
        </div>
        <div className='footer'>
          <button className='cancelBtn' onClick={() => setButtonList(bl => bl.filter(b => b !== buttonObj))}> Delete </button>
          
          <button className='confirmBtn' onClick={() => handleConfirm()}>
            Confirm</button>
        </div>
    </div>
  )
}

export default PresetSettings