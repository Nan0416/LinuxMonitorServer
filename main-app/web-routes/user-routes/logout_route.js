/**
 * smallData_user /query/....
 */

const cors = require('../cors');
const express = require('express');
const logoutRouter = express.Router();
const session_id = require('../../../web_server_config').session_id;
///////////////// route handler /////////////


logoutRouter.route("/")
.options(cors.cors, (req, res, next) => {
    res.sendStatus(200);
})
.get(cors.cors, (req, res, next)=>{
    if(req.session){
        req.session.destroy();
        res.clearCookie(session_id);
        res.statusCode = 200;
        res.json({ success: true, reasons: [],value:"OK"});
    }else{
        res.statusCode = 403;
        res.json({ success: false, reasons: ["You do not login"], value:null });
    }
});
module.exports = logoutRouter;