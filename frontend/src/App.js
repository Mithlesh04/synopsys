import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'react-toastify/dist/ReactToastify.css';
import Routes from './routes/Routes'
import { ToastContainer } from 'react-toastify';
import io from 'socket.io-client';


function App() {

  const sio = (socket)=>{

    socket.on("connect", data => {
      // setResponse(data);
      console.log('socket_connected = ',data);
    });
    
    socket.emit('test','mk','hi');

  }

  useEffect(()=>{
    const newSocket = io(`http://${window.location.hostname}:5000/`);
    // console.log('newSocket = ',newSocket);
    sio(newSocket)
    return () => newSocket.close();

  },[])

  return (
    <>
      <ToastContainer />
      <Routes />
    </>
  );
}

export default App;
