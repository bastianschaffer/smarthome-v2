import React, {useState, useEffect} from 'react'
import SmartButton from './Components/SmartButton'
import './App.css'

//export const btnTypes = {led : "led", light: "light"}

export function postMsg(btnTitle){
    //var request = new XMLHttpRequest();
    //request.open("POST", "/click")
    //request.data = "test";
    //request.send("someData");

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: btnTitle })
    };
    fetch('/click', requestOptions)
        //.then(response => response.json())
        //.then(data => this.setState({ postId: data.id }));
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
                //console.log(data)
                //cnsole.log(data)
                   
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