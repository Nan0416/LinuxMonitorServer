// const cors = require('../cors');
const express = require('express');
const queryKeyRouter = express.Router();
const queryKeys = require('../../db_operations/key_db_ops').queryKeys;
const has_value = require('../../helper_functions').has_value;
queryKeyRouter.route("/")
.get((req, res, next)=>{
    if(has_value(req.user)){
        queryKeys(req.user._id, (err, keys)=>{
            if(err){
                res.statusCode = 400;
                res.json({success: false, reasons:[err.message], value: null});
            }else{
                res.statusCode = 200;
                res.json({success: true, reasons:[], value: keys});
            }
        });
    }else{
        res.statusCode = 400;
        res.json({success: false, reasons:["Please login"], value: null});
    }
});
module.exports = queryKeyRouter;