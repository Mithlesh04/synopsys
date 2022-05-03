import io from 'socket.io-client';

const socket = io(`http://${window.location.hostname}:5000/product`);


function UpdateProduct(data={}){
    socket.emit('pUpdate',data);
}

function ProductNotification(cb){
    if(!cb)cb=_=>null;
    socket.on('pUpdate',cb)
    return ()=>{
        socket.removeListener('pUpdate',cb)
    }
}

function CurrentUserNotification(cb){
    if(!cb)cb=_=>null;
    socket.on('pUpdateCU',cb)
    return ()=>{
        socket.removeListener('pUpdateCU',cb)
    }
}


export {
    UpdateProduct,
    ProductNotification,
    CurrentUserNotification,
    socket
}
