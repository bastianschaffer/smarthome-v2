import React, {useState, useEffect} from 'react'
import SmartButton from './Components/SmartButton'
import './App.css'

export function postMsg(msgType, content){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msgType: msgType, content: content })
    };
    fetch('/userInput', requestOptions)
}

function App() {
    const [buttonList, setButtonList] = useState([{}])

    function presetCount(){
        return buttonList.filter(b => b.type === "preset").length;
    }

    function createPresetButton(setButtonList){
        var newPreset = {title :  "Preset " + (presetCount() + 1), type : "preset", toggled: true,
                        toggledButtons : buttonList.filter(b => b.toggled && b.type !== "preset")};
        setButtonList(bl => [...bl, newPreset]);
        
        postMsg("createPreset", newPreset);
    }

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
            <h1 className='mainHeader'> Schlaues Heim</h1>
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