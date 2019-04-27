/**
 * Query all meta of each agent instance.
 */


const express = require('express');
const queryAgentRouter = express.Router();
const has_value = require('../../helper_functions').has_value;
const queryAgent = require('../../db_operations/agent_db_ops').queryAgent;


///////////////// route handler /////////////


queryAgentRouter.route("/")
.get((req, res, next)=>{
    if(has_value(req.user) && has_value(req.user._id)){
        res.statusCode = 200;
        queryAgent(req.user._id, (err, result)=>{
            if(err){
                res.statusCode = 403;
                res.json({success: false, reasons:[], value: result});
            }else{
                res.statusCode = 200;
                res.json({success: true, reasons:[], value: result});
            }
        });
    }else{
        res.statusCode = 403;
        res.json({success: false, reasons:["Please login."], value: null});
    }
});
queryAgentRouter.route('/:id')
.get((req, res, next)=>{
    if(has_value(req.user) && has_value(req.user._id) && has_value(req.params["id"])){
        res.statusCode = 200;
        queryAgent(req.user._id, req.params['id'], (err, result)=>{
            if(err){
                res.statusCode = 403;
                res.json({success: false, reasons:[], value: result});
            }else{
                res.statusCode = 200;
                res.json({success: true, reasons:[], value: result});
            }
        });
    }else{
        res.statusCode = 403;
        res.json({success: false, reasons:["Please login."], value: null});
    }
});
module.exports = queryAgentRouter;