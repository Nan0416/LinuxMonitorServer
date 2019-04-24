const verifyPrivilege = require('../db_operations/key_db_ops').verifyPrivilege;

function verify(privilege){
    return (req, res, next)=>{
        verifyPrivilege(privilege, req.body.key, (err, result)=>{
            if(err){
                res.statusCode = 403;
                res.json({success: false, reasons:[err.message], value: result});
            }else if(!result){
                res.statusCode = 403;
                res.json({success: false, reasons:[`You don't have ${privilege} privilege`], value: result});
            }else{
                next();
            }
        })
    };
}
function association(req, res, next){
    // verify if this agent-id is associate with this key.
    next();
}
module.exports.verify = verify;
module.exports.association = association;