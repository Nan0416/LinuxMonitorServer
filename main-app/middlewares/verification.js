const verifyPrivilege = require('../db_operations/key_db_ops').verifyPrivilege;
const agentDB = require('../db_models/agent_db');
const has_value = require('../helper_functions').has_value;
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
// avoid backend server used a right key to push data to a wrong agent instance
// verify the agent is associate with that key.
function association(req, res, next){
    // verify if this agent-id is associated with this key.
    if(has_value(req.body) && has_value(req.body['agent-id']) && has_value(req.body['key'])){
        let query = agentDB.findById(req.body['agent-id']).populate('associatedkey');
        query.exec((err, agent_)=>{
            if(err){
                res.statusCode = 403;
                res.json({success: false, reasons:[err.message], value:null});
            }else if(agent_ == null){
                res.statusCode = 403;
                res.json({success: false, reasons:["Cannot find the agent"], value:null});
            }else{
                if(agent_.associatedkey.value == req.body['key']){
                    next();
                }else{
                    res.statusCode = 403;
                    res.json({success: false, reasons:["The agent is not associated with the given key."], value:null});
                }
            }
        });
    }else{
        res.statusCode = 403;
        res.json({success: false, reasons:["Invalid parameters"], value:null});
    }
}
/* after login has session
verify a user (req.user) has the agent-id (req.params.agentid eterreq.body['agent-id'])
**/
function verifyOwnership(req, res, next){
    if(has_value(req.user) && has_value(req.body)){
        let agentid = null;
        if(has_value(req.params['agentid'])){
            agentid = req.params['agentid'];
        }else if(has_value(req.body['agent-id'])){
            agentid = req.body['agent-id'];
        }
        if(has_value(agentid)){
            agentDB.findById(agentid, (err, agent_)=>{
                if(err){
                    res.statusCode = 403;
                    res.json({success: false, reasons:[err.message], value:null});
                }else if(agent_ == null){
                    res.statusCode = 403;
                    res.json({success: false, reasons:["Cannot find the agent"], value:null});
                }else{
                    if(agent_.ownerid.toString() == req.user._id.toString()){
                        next();
                    }else{
                        res.statusCode = 403;
                        res.json({success: false, reasons:["You don't own this agent"], value:null});
                    }
                }
            });
            return;
        }
    }
    res.statusCode = 403;
    res.json({success: false, reasons:["You don't own this agent"], value:null});
}
module.exports.verify = verify;
module.exports.association = association;
module.exports.verifyOwnership = verifyOwnership;