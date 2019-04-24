
const express = require('express');
const verifyPrivilegeRouter = express.Router();
const verifyPrivilege = require('../../db_operations/key_db_ops').verifyPrivilege;
const has_value = require('../../helper_functions').has_value;
verifyPrivilegeRouter.route("/")
.post((req, res, next)=>{
    if(has_value(req.body.privilege) && has_value(req.body.key)){
        verifyPrivilege(req.body.privilege, req.body.key, (err, result)=>{
            if(err){
                res.statusCode = 400;
                res.json({success: false, reasons:[err.message], value: null});
            }else{
                res.statusCode = 200;
                res.json({success: true, reasons:[], value: result}); // result is true or false.
            }
        });
    }else{
        res.statusCode = 400;
        res.json({success: false, reasons:["Invalid parameters"], value: null});
    }
});
module.exports = verifyPrivilegeRouter;