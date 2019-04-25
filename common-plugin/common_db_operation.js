const commonDB = require('./common_db');

function add_common_metrics(agent_id, data, callback){
    let temp = {
        agent_id:agent_id,
        data:data
    };
    commonDB.create(temp, callback);
}
function query_common_metrics(agent_id, timestamp, callback){
    let query = null;
    if(timestamp == null){
        // query all
        query = commonDB.find({agent_id: agent_id});
    }else{
        // query after timestamp
    }
    query.exec((err, records)=>{
        if(err) callback(err);
        else if(records == null) callback(new Error("Cannot find data"));
        else{
            let result = [];
            for(let index = 0; index < records.length; index++){
                result.push(records[index].data.toObject());
            }
            callback(null, result);
        }
    });
}
module.exports.add_common_metrics = add_common_metrics;
module.exports.query_common_metrics = query_common_metrics;