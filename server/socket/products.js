const { updateProductDetails } = require('../controllers/ProductsController');

function product(socketIo){
    const io = socketIo.of('/product');

    io.on('connection',(socket)=>{
        console.log('product socket connected',socket.id);
        // Add socket to room
        socket.join('product');
         
        socket.on('pUpdate',async (data)=>{

            // update product details
            let res = await updateProductDetails({body:data},null,true)

            // send notification to all users
            socket.broadcast.emit('pUpdate',res);
            
            // send data to the current user (pUpdateCU: product update current user)
            io.to(socket.id).emit('pUpdateCU',res);
            
        })

    })
    

    io.on('disconnect',(socket)=>{
        // Remove socket from room
        socket.leave('product');
    })

}

module.exports = product;