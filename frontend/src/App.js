import React, { useEffect, memo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'react-toastify/dist/ReactToastify.css';
import Routes from './routes/Routes'
import { ToastContainer } from 'react-toastify';
import { ProductNotification, socket } from './socket/product'
import Notifier from "react-desktop-notification"




function App() {
  
  // handleProduct Notifications
  const handleNotification = (data) => {
      // current user socket id
      console.log('product notification = ',data)
      Notifier.start(//start
        "Product Update",
        "product id:- "+data.id,
         window.location.origin,
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
      );
  }

  useEffect(()=>{
    const socket = ProductNotification(handleNotification)

    return ()=>{
      socket()
    }
  },[])

  return (
    <>
      <ToastContainer />
      <Routes />
    </>
  );
}

export default App;
