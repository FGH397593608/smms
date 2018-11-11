//引入mysql模板
var mysql = require("mysql");
//链接数据库
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'smms'
});
//开启数据库
connection.connect();
//暴露出去
module.exports=connection;