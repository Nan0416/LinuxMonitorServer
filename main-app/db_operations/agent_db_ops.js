const agentDB = require('../db_models/agent_db');
const AgentType = require('../db_models/agent_types').AgentType
const crypto = require('crypto');
const userDB = require('../db_models/user_db');
const keyDB = require('../db_models/key_db');
const selected_fields = "name type status";
function addAgent(agent_type, key, callback){
    keyDB.findOne({value:key}, (err, key)=>{
        if(err){
            callback(err);
            return;
        }else if(key == null){
            callback(new Error(`Cannot find the given key`));
            return;
        }else{
            let userId = key.ownerid;
            userDB.findById(userId, (err, user)=>{
                if(err){
                    callback(err);
                    return;
                }else if(user == null){
                    callback(new Error(`Cannot find the key's owner`));
                    return;
                }else{
                    // instance name
                    let random_ = userId.toString() + key._id.toString() + (new Date()).toString();
                    let hex = crypto.createHmac('md5', random_).digest('hex');
                    let agentInstance = {
                        ownerid: userId,
                        name: `${agent_type}-${hex}`,
                        associatedkey: key._id,
                        type: agent_type
                    };
                    agentDB.create(agentInstance, (err, agent)=>{
                        if(err){
                            callback(err);
                            return;
                        }else if(agent == null){
                            callback(new Error("Failed to instantiate the agent instance."));
                            return;
                        }else{
                            agentDB.findById(agent._id, selected_fields, (err, agent)=>{
                                if(err){
                                    callback(err);
                                }else{
                                    //console.log(agent.toObject());
                                    callback(null, agent.toObject());
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}
module.exports.addAgent = addAgent;