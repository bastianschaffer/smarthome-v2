import React, {useState, useEffect} from 'react'
import SmartButton from './Components/SmartButton'
import './App.css'

//export const btnTypes = {led : "led", light: "light"}

export function postMsg(msgType, content){
    

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msgType: msgType, content: content })
    };
    fetch('/click', requestOptions)
}

function App() {


    const [data, setData] = useState([{}])

    const [buttonList, setButtonList] = useState([{}])


    useEffect(() => {
        fetch("/members").then(
            res => res.json()
        ).then(
            data => {
                setData(data)
                console.log(data)
                console.log(data)
                   
            }
        )

    }, [])

    useEffect(() => {
        fetch("/buttons").then(
            res => res.json()
        ).then(
            buttonList => {
                setButtonList(buttonList)
            }
        )

    }, [])

    return (
        <div className='mainPage'>
            someText
            {(typeof buttonList.buttons === 'undefined') ? (
                <p>Loading...</p>
            ) : (
                buttonList.buttons.map((button, i) =>(
                    //<p key={i}>{button.title}</p>
                    <SmartButton key={i} _title={button.title} _btnType={button.type}/>
                ))
            )}
            
        </div>
        

    )
}

export default App