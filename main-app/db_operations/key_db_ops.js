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
        owerid: userId,
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

// add privilege
function addPrivilege(privilege, keyvalue, callback){

}

// verify privilege
function verifyPrivilege(privilege, keyvalue, callback){

}