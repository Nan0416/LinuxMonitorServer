/**
 * /query/....
 */

const cors = require('../cors');
const express = require('express');
const has_value = require('../../helper_functions').has_value;
const signupRouter = express.Router();

const signup = require('../../db_operations/user_db_ops').signup;
const passport = require('passport');

///////////////// route handler /////////////


signupRouter.route("/")
.options(cors.cors, (req, res, next) => {
    res.sendStatus(200);
})
.post(cors.cors, (req, res, next)=>{
    if(has_value(req.body) 
        && has_value(req.body.username) 
        && has_value(req.body.email)
        && has_value(req.body.password))
    {
        signup(req.body.username, req.body.email, req.body.password, (err, result)=>{
            if(err){
                res.statusCode = 403;
                res.json({success: false, reasons:[err.message], value: null});
            }else{
                res.statusCode = 200;
                passport.authenticate('local')(req, res, ()=>{
                    res.json(result);
                });
            }
        });
    }else{
        res.statusCode = 400;
        res.json({
            success: false,
            reasons:[`Invalid parameters`],
            value:null
        });
    }
}, );
module.exports = signupRouter;