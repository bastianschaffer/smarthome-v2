import React, {useState, useEffect} from 'react'
import SmartButton from './Components/SmartButton'
import './App.css'

export function postMsg(msgType, content){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msgType: msgType, content: content })
    };
    fetch('/click', requestOptions)
}

function createPresetButton(setButtonList){
    setButtonList(bl => [...bl, {title :  "preset" + bl.length, type : "preset", "toggledButtons" : []}]);
    
    //TODO make preset directly store the buttons and send to python

}

function App() {
    const [buttonList, setButtonList] = useState([{}])

    useEffect(() => {
        fetch("/buttons").then(
            res => res.json()
        ).then(
            fetchedButtonList => {
                setButtonList(fetchedButtonList.buttons.map(b => ({...b, openedSettings : false})));
            }
        )

    }, [])

    

    return (
        <div className='mainPage'>
            <h1 className='mainHeader'> Schlaues Heim 123 SlL s</h1>
            <div className='btnList'>
                <div className='buttonList'>
                    {(typeof buttonList === 'undefined') ? 
                        (<p>Loading...</p>) : 
                        (buttonList.filter(b => b.type !== "preset")
                                    .map((b, i) => (<SmartButton key={i} buttonObj={b} setButtonList={setButtonList} />)))
                    }
                </div>
                <div className='presetList'>
                    {buttonList.filter(b => b.type === "preset")
                                .map((b, i) => (<SmartButton key={i} buttonObj={b} setButtonList={setButtonList}  />))}
                </div>

            <hr className='bottomLine'/>
            <button onClick={() => createPresetButton(setButtonList)}> Create Preset </button>
            </div>  
            
        </div>
        

    )
}

export default App