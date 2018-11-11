var express = require('express');
var router = express.Router();
//引入mysql数据库模板
var connection=require("./mysqlmodel")

// 添加分类管理
router.post('/add', function (req, res) {
  let { name, region, resource } = req.body;
  //写入数据
  // let sqlStr = `insert into Classification(c_region,c_name,c_state) values('${region}','${name}','${resource}')`
  let sqlStr = "insert into Classification(c_region,c_name,c_state) values(?,?,?)"
  let sqlArr = [region, name, resource]
  //sql数据录入数据库
  connection.query(sqlStr, sqlArr, function (err, data) {
    if (err)
      throw err;
    if (data.affectedRows > 0) {
      res.send({ "isOK": true, "msg": "数据存储成功" });
    } else {
      res.send({ "isOK": false, "msg": "数据存储失败" });
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

//分类修改-----根据id获取数据
router.post("/classGetId", function (req, res) {
  let { id } = req.body;
  let sqlStr = `select *from classification where c_id=${id}`
  connection.query(sqlStr, function (err, data) {
    if (err)
      throw err;
    res.send(data)
  })
})

//分类修改-----修改数据保存
router.post("/classEdit", function (req, res) {
  let { name, region, resource, c_id } = req.body;
  let sqlStr = "update classification set c_name=?,c_region=?,c_state=? where c_id=?"
  let sqlArr = [name, region, resource, c_id]
  connection.query(sqlStr, sqlArr, function (err, data) {
    if (err) throw err;
    if (data.affectedRows > 0) {
      res.send({ isOK: true, msg: "分类修改成功" })
    } else {
      res.send({ isOK: false, msg: "分类修改失败" })
    }
  })

})

//删除分类管理
router.post("/classDel", function (req, res) {
  let {id} = req.body;
  let sqlStr = "delete from classification where c_id=?"
  let sqlArr = [id];
  connection.query(sqlStr, sqlArr, function (err, data) {
    if (err) throw err;
    if (data.affectedRows > 0) {
      res.send({ isOK: true, msg: "分类删除成功！" })
    } else {
      res.send({ isOK: false, msg: "分类删除失败！" })
    }
  })
})
module.exports = router;
 