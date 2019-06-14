const express = require('express');
const router = express.Router();

router.post('/getuserlist',(req,res,next)=>{
  // console.log(req.body);
  let query =  "SELECT * FROM `user_date_table` WHERE userId = '" + req.body.userId + "'";
  db.query(query, (err, result) => {
    // console.log("result=====",result);
    // console.log("err=====",err);
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'get getuserlist successfully.',
        data: result
      });
    }
  });
});

module.exports = router;
