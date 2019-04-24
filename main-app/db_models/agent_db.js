// agent instance db
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const Agent = new Schema({
    ownerid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    associatedkey:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    type: {
        type:String, // e.g. common, hadoop
        required: true
    },
    status:{
        type: Number,
        default: 1 // 1 normal 
    }
},{
    //updatedAt and createdAt: (ISODate object)
    timestamps: true,

    usePushEach:true
});
Agent.index({ownerid: 1, name: 1}, {unique: true});
Agent.index({associatedkey: 1});


const agent = mongoose.model("agent", Agent);
module.exports = agent;