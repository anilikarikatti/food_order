const mysql = require("mysql2");

 const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'food_order',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    password:"root",


  });


  const getConnectionPool = ()=>{
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,connection)=>{
          if(err){
            reject(err)

          }
          else{
          resolve(connection)
          }
        })
    })
  }

  const getFormattedQuery = (connection,query,params)=>{
      return connection.format(query,params)
  }

module.exports = {getConnectionPool,getFormattedQuery}