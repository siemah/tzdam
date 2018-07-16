const mysql = require('mysql');
 
let connection;

try {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'wallet'
    });
    connection.connect();
} catch (error) {
    throw new Error('ther is error in db')
}

module.exports = connection;