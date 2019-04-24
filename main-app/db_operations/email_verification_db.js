const emailRecordDB = require('../db_models/email_record_db');
const EmailRecordType = require('../db_models/email_record_types').EmailRecordType;
const userDB = require('../db_models/user_db');
const UserStatusType = require('../db_models/user_status_types').UserStatusType;
const crypto = require('crypto');
const selected_fields = "username email profile status";
// err, key
function generateVerificationEmail(userId, email, callback){
    let r_ = Math.random() * 10000;
    let str_ = userId.toString() + r_.toString();
    let value = crypto.createHmac('sha1', str_).digest('hex').toString('utf-8');
    // [TODO] check key does not existed ...
    let data = {
        userid: userId,
        value: value,
        email: email,
        status:0,
        type: EmailRecordType.Verification,
    }
    emailRecordDB.create(data, (err, result)=>{
        if(err){
            callback(err);
        }else{
            callback(null, result.toObject());
        }
    })
}
function activateEmail(value, callback){
    emailRecordDB.findOne({value: value}, (err, data)=>{
        if(err){
            callback(err);
        }else if(data != null && data.type == EmailRecordType.Verification){
            let userid = data.userid;
            userDB.findById(userid, selected_fields, (err, user)=>{
                if(err){
                    callback(err);
                }else if(user != null && user.status == UserStatusType.AccountRegistered){
                    user.status = UserStatusType.EmailVerified;
                    user.save((err, user)=>{
                        //[ToDo] delete that record.

                        if(err) callback(err);
                        else callback(null, user.toObject());
                    });
                }else if(user == null){
                    callback(new Error("Account does not exist."));
                }else{
                    callback(new Error("Account already verified."));
                }
            });
        }else{
            callback(new Error("Link does not exist."));
        }
    });
}
module.exports.generateVerificationEmail = generateVerificationEmail;
module.exports.activateEmail = activateEmail;