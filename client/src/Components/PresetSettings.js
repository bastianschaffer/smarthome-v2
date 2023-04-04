import React, {useState} from 'react'
import { postMsg } from '../App';
import './ButtonSettings'


function PresetSettings({buttonObj, setButtonList}) {
  const [inputName, setInputName] = useState(buttonObj.title);

  function handleTitleChange(event) {    
    setInputName(event.target.value); 
   }

   function handleConfirm(){
    postMsg("renamePreset", {"title" : buttonObj.title, "newTitle" : inputName});
    setButtonList(bl => bl.map(b => b === buttonObj ? {...b, openedSettings: false, title: inputName} : b));
   }

   function handleDeletePreset(){
    setButtonList(bl => bl.filter(b => b !== buttonObj));
    postMsg("deletePreset", {"title" : buttonObj.title});
   }

  return (
    <div className='buttonSettingsContainer'>
      <input type="text" value={inputName} onChange={handleTitleChange} />
        {/* later maybe add timing functionality and alarm synchronization here */}
        <div className='bottomButtons'> 
        </div>
        <div className='footer'>
          <button className='cancelBtn' onClick={() => handleDeletePreset()}> Delete </button>
          
          <button className='confirmBtn' onClick={() => handleConfirm()}>
            Confirm</button>
        </div>
    </div>
  )
}

export default PresetSettings