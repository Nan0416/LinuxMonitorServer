const userDB = require('../db_models/user_db');
const generateKey = require('./key_db_ops').generateKey;
const generateVerificationEmail = require('./email_verification_db').generateVerificationEmail;
const selected_fields = "username email profile status";
const mailgun_api_key = require('../../secret').mailgun_api_key;
const mailgun_domain = require('../../secret').mailgun_domain;
const mailgun = require('mailgun-js')({apiKey: mailgun_api_key, domain: mailgun_domain})

function validateUsername(username){
    // 6 - 20 char from [0-9, a-z, A-Z]
    if(typeof username === "string"){
        if(username.length >= 6 && username.length <= 20){
            for (let i = 0; i < username.length; i++) {
                if((username.charAt(i) >= '0' && username.charAt(i) <= '9') || 
                    (username.charAt(i) >= 'a' && username.charAt(i) <= 'z') || 
                    (username.charAt(i) >= 'A' && username.charAt(i) <= 'Z'))
                {
                        
                }else{
                    return "Character in username must come from 0-9, a-z or A-Z";
                }
            }
            return "OK";
        }
        return "Username's length should from 6 to 20"
    }
    return "Invalid username";
}
function validatePassword(password){
    let az = /[a-z]/;
    let AZ = /[A-Z]/;
    //let n09 = /[0-9]/;
    if(typeof password === "string"){
        if(password.length >= 8 && password.length <= 40){
            let valid = 0;
            if(az.test(password)){
                valid++;
            }
            if(AZ.test(password)){
                valid++;
            }
            /*if(n09.test(password)){
                valid++;
            }*/
            if(valid >= 2){
                return "OK";
            }
            return "Password must contain at least one lowercase and one uppercase character";
        }
        return "Password's length should from 8 to 40";
    }
    return "Invalid password";
}
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
//////////////////////////////////////////////////////////////////////////
///////////////////////// Send verification email ////////////////////////
//////////////////////////////////////////////////////////////////////////

function send_verification_email(username, email, value, callback){
    const data = {
        from: 'LinuxMonitor <support@monitor.qinnan.dev>',
        to: email,
        subject: 'LinuxMonitor Support',
        text: 
`Hi ${username}. Please confirm your email address by clicking on the link below. \n
If you did not sign up for a LinuxMonitor account please disregard this email.\n
https://monitor.qinnan.dev/activate/${value}`
    };
      
    mailgun.messages().send(data, callback);
}



///////////////////////////////////////////////////////////////////////////
/////////////////////////// sign up operation /////////////////////////////
///////////////////////////////////////////////////////////////////////////


/**
 * 
 * @param {*} username 
 * @param {*} email 
 * @param {*} password 
 * @param {*} callback 
 * 1. create user account, 2. generate verification email, 3. send email 4. generate default key.
 */
function signup(username, email, password, callback){

    let result = validateUsername(username);
    if(result !== "OK"){
        callback(new Error(result));
        return;
    }
    result = validatePassword(password);
    if(result !== "OK"){
        callback(new Error(result));
        return;
    }
    if(!validateEmail(email)){
        callback(new Error(`Invalid email ${email}`));
        return;
    }
    
    userDB.register(new userDB({ username : username, email: email }), password, function(err, user) {
        if (err) {
            callback(err);
        }else{
            let userid = user._id;
            // generate email verification
            generateVerificationEmail(userid, email, (err, email_result)=>{
                if(err){
                    user.remove(()=>{
                        callback(err);
                    });
                    return;
                }else if(!result){
                    user.remove(()=>{
                        callback(new Error("Cannot generate verification email"));
                    });
                    return;
                }else{
                    // send email
                    send_verification_email(username, email, email_result.value, (err, body)=>{
                        if(err){
                            console.log(`Mailgun ${err} ${err.message}`);
                        }else{
                            console.log(`Mailgun ${body.message}`);
                        }
                    });
                    // generate a default key
                    generateKey(user._id, (err, key)=>{
                        if(err){
                            callback(err);
                        }else if(key == null){
                            callback("Failed to generate a private key");
                        }else{
                            user.keys.push(key._id);
                            user.save((err, user)=>{
                                if(err) callback(err);
                                else{
                                    userDB.findById(user._id, selected_fields, callback);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}
//////////////////////////////////////////////////////////////////
/////////////////////// login/////////////////////////////////////
//////////////////////////////////////////////////////////////////

// user can login with username or email
function login(username_email, callback){
    let condition = {}
    if(validateEmail(username_email)){
        condition['email'] = username_email;
    }else{
        condition['username'] = username_email;
    }
    // login with email,  find username via email.
    userDB.findOne(condition, selected_fields, (err, user)=>{
        if(err){
            callback(err);
            return;
        }else if(user == null){
            callback(new Error("Username or password is invalid."));
        }else{
            callback(null, user.toObject());
        }
    });   
}
///////////////////////////////////////////////////////////////////////////
/////////////////// report status /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

function modifyTargetStatus(req, res, callback){
    callback(null);
}
//////////////////////////////////////////////////////////////////
///////////// query user /////////////////////////////////////////
/////////////////////////////////////////////////////////////////
function queryUser(username, callback){
    userDB.findOne({username: username}, selected_fields, (err, user)=>{
        if(err){
            callback(err);
        }else if(user){
            callback(null, user.toObject());
        }else{
            callback(new Error("User does not exist."));
        }
    });
}

function deleteUser(username_or_email, callback){

}
function updatePassword(username, callback){
    //user.setPassword save
    //https://stackoverflow.com/questions/17828663/passport-local-mongoose-change-password
}


module.exports.signup = signup;
module.exports.login = login;
module.exports.queryUser = queryUser;

module.exports.modifyTargetStatus = modifyTargetStatus;