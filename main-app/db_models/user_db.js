const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const UserStatusType = require('./user_status_types').UserStatusType;
const User = new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    type:{
        type: Number, 
        default: 1
    },
    profile:{
        type: String,
        required: false,
    },
    // 0 registered, 1 email verified
    status:{
        type: Number,
        required: true,
        default: UserStatusType.AccountRegistered
    },
    keys:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "key"
        }
    ],
    agents: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "target"
        }
    ],
    // shared agent
    // ...
},{
    //updatedAt and createdAt: (ISODate object)
    timestamps: true,
    usePushEach:true
});
// add username, password, salt
User.plugin(passportLocalMongoose);

const user = mongoose.model("user", User);
module.exports = user;