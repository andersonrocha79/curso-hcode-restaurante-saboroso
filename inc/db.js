
const mysql = require('mysql2');
 
const connection = mysql.createConnection(
{
    host: 'localhost',
    user: 'user',
    password: 'pass',    
    database: 'saboroso',
});
 
module.exports = connection;