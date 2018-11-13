var express = require('express');
var router = express.Router();

//引入mysql数据库模板
var connection = require("./mysqlmodel")

// 添加商品
router.post('/add', function (req, res) {
    let { region, barCode, name, value, marketPrice, salePrice, num, weigth, unit, membership, resource, details } = req.body;
    //写入数据
    let sqlStr = "insert into item(c_id,barCode,i_name,value,marketPrice,salePrice,num,weigth,unit,membership,resource,details) values(?,?,?,?,?,?,?,?,?,?,?,?)"
    //防止sql注入,提高安全性
    let sqlArr = [region, barCode, name, salePrice, marketPrice, value, num, weigth, unit, membership, resource, details]
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

//商品管理
router.post("/itemList", function (req, res) {
    let { currentPage, pageSize,keywords,category } = req.body;
    let sqlStr = 'select t1.*,t2.c_name from item as t1 LEFT JOIN classification as t2 on t1.c_id=t2.c_id where 1=1';
    //获取总条数
    connection.query(sqlStr, function (err, data) {
        if (err)
            throw err;
        var total = data.length;
        //搜索模块
        if(category){
            sqlStr+=` and t1.c_id=${category}`
        }
        if(keywords){
            sqlStr+=` and  (t1.barCode like '%${keywords}%' or t1.i_name like '%${keywords}%')`
        }
        if(category||keywords){
            //获取搜索过后的条目数
            connection.query(sqlStr, function (err, data) {
                if (err)
                    throw err;
                total = data.length;
            })
        }
        // 分页模块
        var skip = (currentPage - 1) * pageSize;
        let sqlArr = [skip, parseInt(pageSize)]
        sqlStr += " limit ?,?"
        connection.query(sqlStr, sqlArr, function (err, data) {
            if (err)
                throw err;
            res.send({ "total": total, "data": data });
        })
    })
})

//账号id信息查找-----账号修改
// router.post("/itemIDFind", function (req, res) {
//   var i_id = req.body.id;
//   let sqlStr = `select *from item where i_id=${i_id}`
//   connection.query(sqlStr, function (err, data) {
//     if (err)
//       throw err;
//     res.send(data)
//   })
// })
//账号修改
// router.post("/userEdit", function (req, res) {
//   let { pass, username, region, u_id, oldPass } = req.body;
//   if (pass != oldPass) {
//     //密码加密处理
//     pass = crypto.createHash("md5").update(pass).digest("hex")
//   }
//   let sqlStr = "update users set userName=?,userPwd=?,userRegion=? where u_id=?"
//   let sqlArr = [username, pass, region, u_id]
//   connection.query(sqlStr, sqlArr, function (err, data) {
//     if (err) throw err;
//     if (data.affectedRows > 0) {
//       res.send({ "isOK": true, "msg": "账户信息修改成功" })
//     } else {
//       res.send({ "isOK": false, "msg": "账户信息修改失败" })
//     }
//   })
// })

// 商品删除
router.post("/itemDel", function (req, res) {
    var i_id = req.body.id;
    let sqlStr = `delete from item where i_id=${i_id}`
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
