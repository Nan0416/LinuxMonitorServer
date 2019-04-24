/**
 * smallData_user /query/....
 */

const cors = require('../cors');
const express = require('express');
const addPrivilegeRouter = express.Router();
const has_value = require('../../helper_functions').has_value;
const addPrivilege = require('../../db_operations/key_db_ops').addPrivilege;
const verifyOwnership = require('../../db_operations/key_db_ops').verifyOwnership;

///////////////// route handler /////////////


addPrivilegeRouter.route("/")
.options(cors.cors, (req, res, next) => {
    res.sendStatus(200);
})
.post(cors.cors, (req, res, next)=>{
    if(has_value(req.body) && has_value(req.body.privilege, req.body.key)){
        // verify if the user has this key
        verifyOwnership(req.body.key, req.user._id, (err, ownership)=>{
            if(err){
                res.statusCode = 403;
                res.json({success: false, reasons:[err.message], value: null});
            }else if(!ownership){
                res.statusCode = 403;
                res.json({success: false, reasons:["You don't own this key"], value: null});
            }else{
                addPrivilege(req.body.privilege, req.body.key, (err, key)=>{
                    if(err){
                        res.statusCode = 403;
                        res.json({success: false, reasons:[err.message], value: null});
                    }else if(key == null){
                        res.statusCode = 403;
                        res.json({success: false, reasons:["Cannot find the key"], value: null});
                    }else{
                        res.statusCode = 200;
                        res.json({success: true, reasons:[], value: key});
                    }
                });
            }
        });
    }else{
        res.statusCode = 403;
        res.json({success: false, reasons:['Invalid parameter'], value: null});
    }
});
module.exports = addPrivilegeRouter;