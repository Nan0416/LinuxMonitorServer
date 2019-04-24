const express = require('express');
const addAgentRouter = express.Router();
const verifyPrivilege = require('../../db_operations/key_db_ops').verifyPrivilege;
const addAgent = require('../../db_operations/agent_db_ops').addAgent;
const has_value = require('../../helper_functions').has_value;
addAgentRouter.route("/")
.post((req, res, next)=>{
    if(has_value(req.body.agenttype) && has_value(req.body.key)){
        verifyPrivilege(req.body.agenttype, req.body.key, (err, result)=>{
            if(err){
                res.statusCode = 403;
                res.json({success: false, reasons:[err.message], value: null});
            }else if(!result){
                res.statusCode = 403;
                res.json({success: false, reasons:[`Your key does not has the privilege.`], value: null});
            }else{
                addAgent(req.body.agenttype, req.body.key, (err, result)=>{
                    if(err) {
                        res.statusCode = 403;
                        res.json({success: false, reasons:[err.message], value: null});
                    }else if(result){
                        res.statusCode = 200;
                        res.json({success: true, reasons:[], value: result});
                    }else{
                        res.statusCode = 403;
                        res.json({success: false, reasons:["Cannot create an agent instance."], value: null});
                    }
                });
            }
        });
    }else{
        res.statusCode = 400;
        res.json({success: false, reasons:["Invalid Parameters"], value: null});
    }
});
module.exports = addAgentRouter;