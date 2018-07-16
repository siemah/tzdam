const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

// launch app 
let app = express();
// MYSQL config
/*var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wallet'
});
connection.connect();*/

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );

/****** routers configuration *******/

// allow to access this API CORS
app.use((req, res, next)=>{

    res.setHeader("Access-Control-Allow-Origin", "*");

    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
})

app.use(require('./routes/post/auth'));
app.use(require('./routes/post/user'));
app.use(require('./routes/post/transfer'));
app.use(require('./routes/get/history'));

app.listen(8888, err => console.log('runing server'))