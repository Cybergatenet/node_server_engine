const SQL = require('mysql')

const MYSQL = SQL.createConnection({
    host: "localhost",
    user: "root",
    password: '123456',
    database: 'expressdb'
})

MYSQL.connect((err, result) => {
    if (err) throw err

    console.log(`DB Connected`)
    
})


module.exports = MYSQL