var express = require('express');
var router = express.Router();
//引入密码加密模板
var crypto = require("crypto")

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

// 添加账号
router.post('/add', function (req, res) {
  let { username, pass, region } = req.body;
  //密码加密处理
  pass = crypto.createHash("md5").update(pass).digest("hex")//digest:使用多少进制的加密
  //写入数据
  // let sqlStr = `insert into users(username,userPwd,userRegion) values('${username}','${pass}','${region}')`
  let sqlStr = "insert into users(username,userPwd,userRegion) values(?,?,?)"
  //防止sql注入,提高安全性
  let sqlArr = [username, pass, region]
  //sql数据录入数据库
  connection.query(sqlStr, sqlArr, function (err, data) {
    if (err)
      throw err;
    if (data.affectedRows > 0) {
      res.send({ "isOK": true, "msg": "数据保存成功" });
    } else {
      res.send({ "isOK": false, "msg": "数据保存失败" });
    }
  })
});

//账号管理
router.post("/userList", function (req, res) {
  let sqlStr = 'select *from users order by u_id DESC';
  connection.query(sqlStr, function (err, data) {
    if (err)
      throw err;
    res.send(data);
  })
})

//账号id信息查找-----账号修改
router.post("/userIDFind", function (req, res) {
  var u_id = req.body.id;
  let sqlStr = `select *from users where u_id=${u_id}`
  connection.query(sqlStr, function (err, data) {
    if (err)
      throw err;
    res.send(data)
  })
})

router.post("/userEdit", function (req, res) {
  let { pass, username, region, u_id, oldPass } = req.body;
  if (pass != oldPass) {
    //密码加密处理
    pass = crypto.createHash("md5").update(pass).digest("hex")
  }
  let sqlStr = "update users set userName=?,userPwd=?,userRegion=? where u_id=?"
  let sqlArr = [username, pass, region, u_id]
  connection.query(sqlStr, sqlArr, function (err, data) {
    if (err) throw err;
    if (data.affectedRows > 0) {
      res.send({ "isOK": true, "msg": "账户信息修改成功" })
    } else {
      res.send({ "isOK": false, "msg": "账户信息修改失败" })
    }
  })
})


// 账号删除
router.post("/userDel", function (req, res) {
  var u_id = req.body.id;
  let sqlStr = `delete from users where u_id=${u_id}`
  connection.query(sqlStr, function (err, data) {
    if (err)
      throw err;
    if (data.affectedRows > 0) {
      res.send({ "isOK": true, "msg": "账户删除成功" })
    } else {
      res.send({ "isOK": false, "msg": "账户删除失败" })
    }
  })
})

module.exports = router;
