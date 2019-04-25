const commonDB = require('./common_db');

function add_common_metrics(agent_id, data, callback){
    let temp = {
        agent_id:agent_id,
        data:data
    };
    commonDB.create(temp, callback);
}
// timestamp in second (unix timestamp)
function query_common_metrics(agent_id, timestamp, callback){
    let condition = {agent_id: agent_id};
    if(timestamp != null){
        condition['createdAt'] = {$gte: new Date(timestamp * 1000)};
    }
    commonDB.find(condition, (err, records)=>{
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