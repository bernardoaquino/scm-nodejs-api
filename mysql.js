const mysql = require('mysql');

var pool = mysql.createPool({
    "connectionLimit": 1000, //Limite máximo do pool de conexões
    "user": process.env.MYSQL_USER, //Usar variável de ambiente
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": process.env.MYSQL_HOST,
    "port": process.env.MYSQL_PORT
});

exports.execute = (query, params = []) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (error, result, fileds) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    })
}

exports.pool = pool;