// email verification db
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const EmailMessageRecord = new Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    status:{
        type: Number,
        default: 0 // example 0 still valid, 1 verified, -1 expired ...
    },
    type:{
        type: Number, // comment: e.g. purpose of this item verifying email
        default: ""
    }
},{
    //updatedAt and createdAt: (ISODate object)
    timestamps: true,

    usePushEach:true
});

EmailMessageRecord.index({value: 1}, {unique: true});
EmailMessageRecord.index({userid:1 , type: 1});

const emailMessageRecord = mongoose.model("emailrecord", EmailMessageRecord);
module.exports = emailMessageRecord;
