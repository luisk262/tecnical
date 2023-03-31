const express = require('express');
const router = express.Router();

const db = require('../database');
const md5 = require("md5");
const jwt = require('jsonwebtoken');
const _ = require('lodash');

/* login */
router.post('/login', async function (req, res, next) {
  const sql = "select * from user where email = ?"
  const params = [req.body.email]
  await db.get(sql, params, (err, row) => {
   
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    if(_.get(row,'email',false)){
      const password = _.get(row,'password',null)
      if(password == md5(req.body.password)){
        const token = jwt.sign({
          email: row.email,
          name:row.name,
          id: row.id
        },'fake-secret')

        res.json({
          "message":"success",
          "data":row,
          "token":token
        })
      }else{
        res.json({
          "message":"invalid credentials"
        })
      } 
    }else{
      res.json({
        "message":"User not exist",
      })
    }
  });
});

router.post('/singin', async function (req, res, next) {
  var data = {
    name: req.body.name,
    email: req.body.email,
    password: md5(req.body.password),
    image: _.get(req.body,'image','')
  }
  var sql = 'INSERT INTO user (name, email, password,image) VALUES (?,?,?,?)'
  var params = [data.name, data.email, data.password,data.image]
  await db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ "error": err.message })
      return;
    }
    res.json({
      "message": "success",
      "data": data
    })
  })
});

module.exports = router;
