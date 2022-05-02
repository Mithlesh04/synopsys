import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'react-toastify/dist/ReactToastify.css';
import Routes from './routes/Routes'
import { ToastContainer } from 'react-toastify';
import io from 'socket.io-client';


function App() {

  const sMsg = (socket)=>{
    // join
    var username = Math.random();
    if (username < 0.5)
      username = 'RAM'
    else
      username = 'MK'
    
    socket.emit('join', { username  , room: 'product' }, error => {
      if (error) {
        console.log(error);
      }
    });

    socket.on('message', message => {
      console.log(message);
    });

    socket.on('roomData', ({ users }) => {
      console.log("users = ",users);
    });
    // https://medium.com/swlh/build-a-chat-room-with-node-js-and-socket-io-e3e43f49a02d
  }

  const sio = (socket)=>{

    socket.on("connect", data => {
      // setResponse(data);
      console.log('socket_connected = ',data);
    });
    
    socket.emit('test','mk','hi');

    socket.on("pUpdate", data => {
      console.log('socket_pUpdate = ',data);
    })


    

  }

  useEffect(()=>{
    const newSocket = io(`http://${window.location.hostname}:5000/`);
    // console.log('newSocket = ',newSocket);
    sio(newSocket)
    sMsg(newSocket)
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
