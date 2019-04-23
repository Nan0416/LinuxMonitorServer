/**
 * 1. A user first register an account
 * 2. The user then add targets
 * 3. The user go to the target, and run the device.
 */

const express = require('express');
const app = express();
const server = require('http').createServer(app);

const domain = require('./agent_server_config').agent_server_domain;
const port = require('./agent_server_config').agent_server_port;
const urlprefix = require('./agent_server_config').agent_url_prefix
const mongodb_url = require('./agent_server_config').mongodb_url;

const enabled_plugins = [
    "common-plugin"
];



///////// Express middleware //////////
const logger = require('morgan');
const bodyParser = require('body-parser');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    limit: '50mb',
    extended: true
}));


///////// Database configurations //////////
const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;
mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true);
//mongoose.set('debug', true);
const connect = mongoose.connect(mongodb_url, {
});
connect.then((db)=>{
        console.log("[mongodb] connected correctly to server");
    }, (err)=>{
        console.log("[mongodb] connection failed")
        console.log(err);
});


//////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// Route setup         ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

// add plugins
for(let i = 0 ; i < enabled_plugins.length; i++){
    let plugin_config = require(`./${enabled_plugins[i]}/config`);
    let agent_router = require(`./${enabled_plugins[i]}/routes/agent-routes`);
    let plugin_url = plugin_config.endpoint;
    let url = `${urlprefix}/plugin/${plugin_url}`
    console.log(url)
    app.use(url, agent_router);
}



//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////


server.listen(port, domain);
console.log(`LinuxMonitor server is running at http://${domain}:${port}`);
