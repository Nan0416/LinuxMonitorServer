/**
 * 1. A user first register an account, and then system generates a private api key for the user
 * 2. The user enable plugin for this key
 * 3. The user run agents in the desired targets with supplying the private api key and account.
 */

const express = require('express');
const app = express();
const server = require('http').createServer(app);

const domain = require('./web_server_config').web_server_domain;
const port = require('./web_server_config').web_server_port;
const mongodb_url = require('./web_server_config').mongodb_url;
const urlprefix = require('./web_server_config').web_url_prefix;
const session_key = require('./web_server_config').session_key;
const session_id = require('./web_server_config').session_id;

// user account management
const signupRoute = require('./main-app/routes/user_routes/signup_route');
const loginRoute = require('./main-app/routes/user_routes/login_route');
const logoutRoute = require('./main-app/routes/user_routes/logout_route');
const activateRoute = require('./main-app/routes/user_routes/activate_route');
//const keyManagementRoute = require('./main-app/routes/user_routes/key_route');
// agent
/* const registerTargetRoute = require('./routes/target_routes/register_route');
const queryTargetsRoute = require('./routes/target_routes/query_route');
const reportTargetRoute = require('./routes/target_routes/report_route');
const deleteTargetRoute = require('./routes/target_routes/delete_route');*/
// cors
const cors = require('./main-app/routes/cors');

///////// Express middleware //////////
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const passport = require('passport');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    limit: '50mb',
    extended: true
}));
// user_app.use(cookieParser(cookie_key));
const session_config = session({
    name: session_id,
    secret: session_key,
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
});
app.use(session_config);
app.use(passport.initialize());
app.use(passport.session());

////////// Passport configuration ////////////////////////
const userDB = require('./main-app/db_models/user_db');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(userDB.authenticate()));
passport.serializeUser(userDB.serializeUser());
passport.deserializeUser(userDB.deserializeUser());


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

/////////// Authentication //////////////////

function session_authentication(req, res, next){
    // this session is loaded from the file system with a key "file name" as the cookie
    // but using cookie is hidden from the developer.
    if(!req.user){
        res.statusCode = 403;
        res.json({
            success: false,
            reasons:["Please login or signup first"],
            value: null
        });
    }else{
        next();
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////Route setup         /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

app.use(urlprefix + '/user/signup', signupRoute);
app.use(urlprefix + '/user/login', loginRoute);
app.use(urlprefix + '/user/activate', activateRoute);
// app.use(url_prefix + '/target/report', reportTargetRoute);
app.use(cors.cors, session_authentication);
app.use(urlprefix + '/user/logout', logoutRoute);
/*app.use(url_prefix + '/target/register', registerTargetRoute);
app.use(url_prefix + '/target/query', queryTargetsRoute);
app.use(url_prefix + '/target/delete', deleteTargetRoute);*/


//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////


server.listen(port, domain);
console.log(`LinuxMonitor server is running at http://${domain}:${port}`);
