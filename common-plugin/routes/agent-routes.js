/**
 * 
 */
const express = require('express');
const router = express.Router();
const has_value = require('../helper_functions').has_value;
const verification = require('../../main-app/middlewares/verification');
// db operation
const add_common_metrics = require('../common_db_operation').add_common_metrics;


router.route('/')
.post(verification.verify("common"), verification.association, (req, res, next) => {
    if(has_value(req.body) && has_value(req.body["agent-id"]) && has_value(req.body["data"])){
        // verify association. is this agent-id is associated with this key????

        add_common_metrics(req.body["agent-id"], req.body["data"], (err, result)=>{
            if(err){
                res.statusCode = 403;
                res.json({success: false, reasons: [err.message], value: null});
            }else{
                res.statusCode = 200;
                res.json({success: true,reasons: [],value:result});
            }
        });
    }else{
        res.statusCode = 400;
        res.json({success: false, reason:[`Invalid body`], value: null});
    }
});


module.exports = router;