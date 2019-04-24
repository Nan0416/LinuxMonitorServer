// key instance db
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const Key = new Schema({
    ownerid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    value: {
        type: String,
        required: true,
    },
    privileges:{
        type:[String], // e.g. common, hadoop
        default: []
    },
    status:{
        type: Number,
        default: 1 // 1 endabled 0 disabled
    }
},{
    //updatedAt and createdAt: (ISODate object)
    timestamps: true,

    usePushEach:true
});
Key.index({ownerid: 1});
Key.index({value: 1}, {unique: true});


const key = mongoose.model("key", Key);
module.exports = key;