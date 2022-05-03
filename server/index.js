const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const upload = require('multer')({ dest: 'uploads/' });
const cors = require('cors');
const http = require('http').Server(app);
const port = 5000;


app.use(cors());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing application/json
app.use(bodyParser.json());

// for parsing multipart/form-data
// app.use(upload.array()); 
app.use(upload.any());
app.use(express.static('public'));


// products routes
app.use('/products', require('./routes/products'));



const socketIo = require("socket.io")(http, {
    cors: {
        origin: "*",
        reconnection: true,
        reconnectionDelay: 10000
        // methods: ["GET", "POST"],
        // allowedHeaders: ["my-custom-header"],
        // credentials: true
    }
})

// set socket.io listeners to all incoming requests
app.set('socketIo', socketIo);


app.get('/', (req, res) => {
    res.send('hello world')
});



// socket connection
http.listen(port, (e) => {
    console.log('listening on port = ', port);
})


const io = socketIo.of('/');

// socket connection event for product
require('./socket/products')(socketIo);


io.on('connection', (socket) => {
   
    socket.on('test', function (from, msg) {
        console.log('test', from, ' saying ', msg);
    });

})



