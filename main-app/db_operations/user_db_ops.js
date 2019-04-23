const userDB = require('../db_models/user_db');
const session_id = require('../../web_server_config').session_id;


const selected_field = "username email profile status";

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


///////////////////////////////////////////////////////////////////////////
/////////////////////////// sign up operation /////////////////////////////
///////////////////////////////////////////////////////////////////////////

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
            // send email
            // generate a default key
            callback(null, user.toObject());
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
    userDB.findOne(condition, selected_field, (err, user)=>{
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
    userDB.findOne({username: username}, selected_field, (err, user)=>{
        if(err){
            callback({
                success: false,
                reasons: [err.message],
                value: null
            });
        }else if(user){
            callback({
                success: true,
                value: user,
                reasons:[]
            });
        }else{
            callback({
                success: true,
                value: null,
                reasons:[`Not found`]
            });
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