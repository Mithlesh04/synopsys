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

// set socket.io listeners
app.set('socketIo', socketIo);


app.get('/', (req, res) => {
    res.send('hello world')
});



// socket connection
http.listen(port, (e) => {
    console.log('listening on port = ', port);
})


const io = socketIo.of('/');

const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
  } = require('./utils/User');

io.on('connection', (socket) => {

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name: username, room }); // add user with socket id and room info
        if (error) return callback(error);

        socket.join(user.room);
        // socket.join(user.room);

        socket.emit('message', {
            user: 'adminX',
            text: `${user.name.toUpperCase()}, Welcome to ${user.room} room.`
        });
        console.log('user.room = ',user.room)
        socket.broadcast.to(user.room).emit('message', {
            user: 'adminX',
            text: `${user.name.toUpperCase()} has joined!`
        });

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room) // get user data based on user's room
        });

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
      
        if (user) {
          io.to(user.room).emit('message', {
            user: 'adminX',
            text: `${user.name.toUpperCase()} has left.`
          });
          io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
          });
        }
    });

   
    socket.on('test', function (from, msg) {
        console.log('test', from, ' saying ', msg);
    });

})



