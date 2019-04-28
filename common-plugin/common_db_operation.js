const commonDB = require('./common_db');

function add_common_metrics(agent_id, data, callback){
    let temp = {
        agent_id:agent_id,
        data:data
    };
    commonDB.create(temp, callback);
}
// timestamp in second (unix timestamp)
function query_common_metrics(agent_id, from, to, callback){
    let condition = {agent_id: agent_id};
    
    if(from != null && to != null){
        condition['createdAt'] = {
            $gte: new Date(timestamp),
            $lt: new Date(timestamp),
        };
    }else if(from != null){
        condition['createdAt'] = {
            $gte: new Date(timestamp),
        };
    }else if(to != null){
        condition['createdAt'] = {
            $lt: new Date(timestamp),
        };
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