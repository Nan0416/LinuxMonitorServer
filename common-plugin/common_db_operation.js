const common_db = require('./common_db');

function add_common_metrics(agent_id, data, callback){
    let temp = {
        agent_id:agent_id,
        data:data
    };
    common_db.create(temp, callback);
}
function query_common_metrics(agent_id, timestamp, callback){

}
module.exports.add_common_metrics = add_common_metrics;