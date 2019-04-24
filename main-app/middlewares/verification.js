function verify(privilege){
    return (req, res, next)=>{
        next();
    };
}
module.exports.verify = verify;