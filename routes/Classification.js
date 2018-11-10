var express = require('express');
var router = express.Router();
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

// 添加分类管理
router.post('/add', function (req, res) {
  let { name, region, resource } = req.body;
  //写入数据
  // let sqlStr = `insert into Classification(c_region,c_name,c_state) values('${region}','${name}','${resource}')`
  let sqlStr = "insert into Classification(c_region,c_name,c_state) values(?,?,?)"
  let sqlArr=[ region,name, resource]
  //sql数据录入数据库
  connection.query(sqlStr,sqlArr, function (err, data) {
    if (err)
      throw err;
      if(data.affectedRows>0){
          res.send({"isOK":true,"msg":"数据存储成功"});
      }else{
        res.send({"isOK":false,"msg":"数据存储失败"});
      }
  })
});

//分类管理
router.post("/classList", function (req, res) {
  let sqlStr = 'select *from Classification order by c_region DESC';
  connection.query(sqlStr, function (err, data) {
    if (err)
      throw err;
    res.send(data);
  })
})



//账号修改
// router.post("/classEdit",function(req,res){
// var u_id=req.body.id;
// let sqlStr =`select *from users where u_id=${u_id}`
// connection.query(sqlStr, function (err, data) {
//   if (err)
//     throw err;
//   res.send(data)
// })
// })

// 账号删除
// router.post("/userDel",function(req,res){
// var u_id=req.body.id;
// let sqlStr =`delete from users where u_id=${u_id}`
// connection.query(sqlStr, function (err, data) {
//   if (err)
//     throw err;
//   res.send(data)
// })
// })

module.exports = router;
