import React from 'react'

function PresetSettings({buttonObj, setButtonList}) {
  return (
    <div>PresetSettings
        {/* later maybe add timing functionality and alarm synchronization here */}
        <div className='bottomButtons'> 
        </div>
          <button onClick={() => setButtonList(bl => bl.filter(b => b !== buttonObj))}> Delete Preset </button>
          
          <button onClick={() => setButtonList(bl => bl.map(b => b === buttonObj ? {...b, openedSettings: false} : b))}>
            Cancel</button>
    </div>
  )
}

export default PresetSettings