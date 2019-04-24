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
module.exports.verify = verify;