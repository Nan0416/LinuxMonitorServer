const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const DiskIO = new Schema({
    name: {
        type: String,
        required: true,
    },
    read: {
        type: Number,
        require: true,
    },
    write:{
        type: Number,
        required: true,
    }
},{ 
    _id : false 
});
const CommonMetrics = new Schema({
    loadavg: {
        type: [Number],
        required: true,
    },
    corenum: {
        type: Number,
        require: true,
    },
    cpuuser: {
        type: Number,
        required: true,
    },
    cpusys:{
        type: Number,
        required: true,
    },
    memtotal:{
        type: Number,
        required: true,
    },
    memfree:{
        type: Number,
        required: true,
    },
    memavail: {
        type:Number,
        required: true,
    },
    disk:{
        type:[DiskIO],
        required: true,
    },
},{ 
    _id : false,
    timestamps: true,
});


const CommonStorage = new Schema({
    //Agent Instance Id
    agent_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'agent'
    },
    data:{
        type: CommonMetrics,
        required: true,
    }
},{
    //updatedAt and createdAt: (ISODate object)
    timestamps: true,

    usePushEach:true
});
CommonStorage.index({agent_id: 1, createdAt: 1}, {unique: true});
const common = mongoose.model("common", CommonStorage);  // updata name to common-plugin
module.exports = common;