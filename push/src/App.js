import React from 'react';
import logo from './logo.svg';
import './App.css';
import { send } from './utils/Push'
import * as serviceWorker from "./serviceWorker";

const App = () => {
  const onClick = () => {
    // alert("Push sent")
    console.log('Push is sent successfully')
    send("Intorduction to Push Notifications", "Push notification successfully sent to the browser! Check it out!")
  }
  return (
    <>
      <button onClick={() => onClick()}>Send Push</button>
    </>
  )
}

export default App;
serviceWorker.register()
