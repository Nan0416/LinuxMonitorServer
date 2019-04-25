/**
 * activate email
 */

const express = require('express');
const has_value = require('../../helper_functions').has_value;
const activateRouter = express.Router();
const cors = require('../cors');
const activateEmail = require('../../db_operations/email_verification_db').activateEmail;


///////////////// route handler /////////////


activateRouter.route("/:value")
.options(cors.cors, (req, res, next) => {
    res.sendStatus(200);
})
.get(cors.cors,(req, res, next)=>{
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