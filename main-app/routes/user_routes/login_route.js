/**
 * smallData_user /query/....
 */

const cors = require('../cors');
const express = require('express');
const loginRouter = express.Router();
const has_value = require('../../helper_functions').has_value;
const login = require('../../db_operations/user_db_ops').login;
const queryUser = require('../../db_operations/user_db_ops').queryUser;
const passport = require('passport');
///////////////// route handler /////////////


loginRouter.route("/")
.options(cors.cors, (req, res, next) => {
    res.sendStatus(200);
})
.post(cors.cors, (req, res, next)=>{
    if(has_value(req.body) && has_value(req.body.username)){
        login(req.body.username, (err, user)=>{
            if(err){
                res.statusCode = 403;
                res.json({success: false, reasons:[err.message], value: null});
            }else if(!has_value(user)){
                res.statusCode = 400;
                res.json({ success: false, reasons:["Invalid username or password"], value:null});
            }else{
                res.statusCode = 200;
                req.body.username = user.username;
                passport.authenticate('local')(req, res, ()=>{
                    res.json(user);
                });
            }
        })
    }else{
        res.statusCode = 400;
        res.json({ success: false, reasons:[`Invalid parameters`], value:null});
    }
});

/*loginRouter.route("/query")
.options(cors.cors, (req, res, next) => {
    res.sendStatus(200);
})
.post(cors.cors, (req, res, next)=>{
    if(req.user && req.user.username){
        queryUser(req.user.username, (data)=>{
            res.statusCode = 200;
            res.json(data);
        });
    }else{
        res.statusCode = 200;
        res.json({
            success: true,
            value: null,
            reasons:[]
        });
    }
});*/
module.exports = loginRouter;