/**
 * 
 */
const express = require('express');
const router = express.Router();
const has_value = require('../helper_functions').has_value;
const verification = require('../../main-app/middlewares/verification');
// db operation
const query_common_metrics = require('../common_db_operation').query_common_metrics;
const cors = require('../../main-app/web-routes/cors');
// query agent instance
router.route('/')
.options(cors.cors, (req, res, next) => {
    res.sendStatus(200);
})
.post(cors.cors, verification.verifyOwnership, (req, res, next) => {
    if(has_value(req.body) && has_value(req.body["agent-id"])){
        query_common_metrics(req.body["agent-id"], req.body['timestamp'], (err, result_arr)=>{
            if(err){
                res.statusCode = 403;
                res.json({success: false, reasons:[err.message], value: null});
            }else{
                res.statusCode = 200;
                res.json({success: true, reasons:[], value: result_arr});
            }
        });
    }else{
        res.statusCode = 400;
        res.json({success: false, reason:[`Invalid body`], value: null});
    }
});
module.exports = router;