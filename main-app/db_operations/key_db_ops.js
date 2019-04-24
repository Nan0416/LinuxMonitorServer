const keyDB = require('../db_models/key_db');
const crypto = require('crypto');

// err, key
function generateKey(userId, callback){
    let r1 = Math.random() * 100000000;
    let time_ = (new Date()).toString();
    let r2 = Math.random() * 1024;
    let random_ = r1.toString() + time_ + r2.toString();
    let hex = crypto.createHmac('sha256', random_).digest('hex');
    let base64key = new Buffer(hex).toString('base64');
    // [TODO] check key does not existed ...

    let key = {
        ownerid: userId,
        value: base64key,
    }
    keyDB.create(key, (err, result)=>{
        if(err){
            callback(err);
        }else{
            callback(null, result.toObject());
        }
    })
}

/**
 * 
 * @param {*} privilege AgentType
 * @param {*} keyvalue 
 * @param {*} callback (err, key.toObject())
 * 
 * Currently, all applied privileges are approved here. But later, it may depend on the policy. e.g. subscription.
 */
function addPrivilege(privilege, keyvalue, callback){
    keyDB.findOne({value: keyvalue}, (err, key)=>{
        if(err != null) callback(err);
        else if(key == null) callback(new Error("key does not exist."))
        else{
            existed = false;
            for(let i = 0; i < key.privileges.length; i++){
                if(key.privileges[i] == privilege){
                    existed = true;
                    break;
                }
            }
            if(existed){
                callback(null, key.toObject());
            }else{
                key.privileges.push(privilege);
                key.save((err, key_)=>{
                    if(err != null) callback(err);
                    else callback(null, key_ == null? null: key_.toObject());
                })
            }
        }
    });
}

/* verify privilege for agent
* Backend method.
* */
function verifyPrivilege(privilege, keyvalue, callback){
    keyDB.findOne({value: keyvalue}, (err, key)=>{
        if(err != null) callback(err);
        else if(key == null) callback(new Error("key does not exist."))
        else{
            existed = false;
            for(let i = 0; i < key.privileges.length; i++){
                if(key.privileges[i] == privilege){
                    existed = true;
                    break;
                }
            }
            callback(null, existed);
        }
    });
}
// verify owner
function verifyOwnership(keyvalue, userid, callback){
    keyDB.findOne({value: keyvalue}, (err, key)=>{
        if(err != null) callback(err);
        else if(key == null) callback(new Error("key does not exist."))
        else{
            if(key.ownerid.toString() == userid.toString()){
                callback(null, true);
            }else{
                callback(null, false);
            }
        }
    });
}
// query keys
function queryKeys(userid, callback){
    keyDB.find({ownerid: userid}, null, null, (err, keys)=>{
        if(err) callback(err);
        else if(keys == null) callback(new Error("This key does not exist."));
        else {
            let result = [];
            for(let i = 0; i < keys.length; i++){
                result.push(keys[i].toObject());
            }
            callback(null, result)
        }
    });
}
module.exports.generateKey = generateKey;
module.exports.addPrivilege = addPrivilege;
module.exports.verifyPrivilege = verifyPrivilege;
module.exports.verifyOwnership = verifyOwnership;

module.exports.queryKeys = queryKeys;