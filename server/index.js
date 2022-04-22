const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const upload = require('multer')({dest:'uploads/'});
const cors = require('cors');
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


// routes
app.use('/products',require('./routes/products'));

app.get('/', (req, res) => {
    res.send('hello world')
});


app.listen(port, (e) => {
        console.log('listening on port = ',port);
    }
);
