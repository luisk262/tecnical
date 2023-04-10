var express = require('express');
var router = express.Router();

const db = require('../database');
const auth = require("./middleware");

router.get('/',auth, async function (req, res, next) {
  
  const sql = "select * from links where user_id= ?"
  const params = [req.user.id]
  
  await db.all(sql, params, (err, rows) => {
   
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    if(rows){
      res.json({
        "message":"success",
        "data":rows,
      })
    }else{
      res.json({
        "message":"No links",
      })
    }
    
  });
});

router.post('/add',auth, async function (req, res, next) {
  var data = {
    name: req.body.name,
    url: req.body.url,
    user_id : req.user.id
  }
  var sql = 'INSERT INTO links (name, url, user_id) VALUES (?,?,?)'
  var params = [data.name, data.url, data.user_id]
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

router.delete('/',auth, async function (req, res, next) {
  var data = {
    id: req.body.id,
    user_id : req.user.id
  }
  
  const sql = 'DELETE FROM links WHERE  id=? and user_id =?'
  const params = [data.id, data.user_id]
  await db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ "error": err.message })
      return;
    }
    res.json({
      "message": "success" 
    })
  })
});

module.exports = router;
