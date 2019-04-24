/**
 * activate email
 */

const express = require('express');
const has_value = require('../../helper_functions').has_value;
const activateRouter = express.Router();

const activateEmail = require('../../db_operations/email_verification_db').activateEmail;


///////////////// route handler /////////////


activateRouter.route("/:value")
.get((req, res, next)=>{
    activateEmail(req.params.value, (err, user)=>{
        if(err){
            res.statusCode = 403;
            res.json({success: false, reasons:[err.message], value: null});
        }else{
            res.statusCode = 200;
            res.json({success: true, reasons:[], value: user});
        }
    });
});
module.exports = activateRouter;