const cors = require('cors');

const whitelist = [
    "http://192.168.0.103:4200",
    "http://monitor.sousys.com",
    "https://monitor.sousys.com"
];

var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    if(whitelist.indexOf(req.header('Origin')) !== -1){
        corsOptions = {origin: req.header('Origin'), credentials: true};
    }else{
        corsOptions = {origin: false};
    }
    callback(null, corsOptions);
};

module.exports.cors = cors(corsOptionsDelegate);
//module.exports.cors = cors();
