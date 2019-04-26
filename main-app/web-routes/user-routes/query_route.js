/**
 * Query data about this account, including username, email, status, key and key's priviledge, agents and agent's status.
 *  */
/**
 * smallData_user /query/....
 */

const cors = require('../cors');
const express = require('express');
const queryUserRouter = express.Router();
const has_value = require('../../helper_functions').has_value;
const queryUser = require('../../db_operations/user_db_ops').queryUser;

///////////////// route handler /////////////


queryUserRouter.route("/")
.options(cors.cors, (req, res, next) => {
    res.sendStatus(200);
})
.get(cors.cors,(req, res, next)=>{
    if(has_value(req.user) && has_value(req.user.username)){
        queryUser(req.user.username, (err, user)=>{
            if(err){
                res.statusCode = 403;
                res.json({ success: false, reasons:[err.message], value:null});
            }else{
                res.statusCode = 200;
                res.json({ success: true, reasons:[], value: user});
            }
        })
    }else{
        res.statusCode = 400;
        res.json({ success: false, reasons:[`Please login.`], value:null});
    }
});
module.exports = queryUserRouter;