// email verification db
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const EmailVerification = new Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    value: {
        type: String,
        required: true,
    },
    status:{
        type: Number,
        default: 1 // 1 still valid, 0 expired ...
    }
},{
    //updatedAt and createdAt: (ISODate object)
    timestamps: true,

    usePushEach:true
});

Key.index({value: 1}, {unique: true});


const email_verification = mongoose.model("emailverification", EmailVerification);
module.exports = email_verification;