import React from 'react'

function ButtonSettings({setOpenSettings}) {
  return (
    <div className="modalContainer">
              
        <button onClick={() => setOpenSettings(false)}> X </button>
        <div className='title'>
            <h1> LED Strip 1 </h1>
        </div>
        <div className='body'>
            -- selectable animations here --
        </div>
        <div className='footer'>
        <button onClick={() => setOpenSettings(false)}> Close </button>
        <button> Confirm </button>
        </div>
    </div>
    
  )
}

export default ButtonSettings