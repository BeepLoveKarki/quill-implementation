// Load the dotfiles.
require('dotenv').load({silent: true});

var express         = require('express');

// Middleware!
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var morgan          = require('morgan');

var mongoose        = require('mongoose');
var fs              = require('fs');
var port            = process.env.PORT || 3000;
//var database        = process.env.DATABASE || process.env.MONGODB_URI || "mongodb://localhost:27017";
var database        = 'mongodb://baljyoti:'+process.env.ADMIN_PASS+'@quantumhack.cluster-cz3uefblqw46.ap-south-1.docdb.amazonaws.com:27017/participants?ssl=true&replicaSet=rs0&readPreference=secondaryPreferred';
var ca = [fs.readFileSync(__dirname + "/keys/rds-combined-ca-bundle.pem")];

var settingsConfig  = require('./config/settings');
var adminConfig     = require('./config/admin');

var app             = express();

// Connect to mongodb
mongoose.connect(database,{
   sslValidate:false,
   sslCA:ca,
   useNewUrlParser: true,
   useUnifiedTopology: true
},
  function(err, client) {
    if(err)
      throw err;
});

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(methodOverride());

app.use(express.static(__dirname + '/app/client'));

// Routers =====================================================================

var apiRouter = express.Router();
require('./app/server/routes/api')(apiRouter);
app.use('/api', apiRouter);

var authRouter = express.Router();
require('./app/server/routes/auth')(authRouter);
app.use('/auth', authRouter);

require('./app/server/routes')(app);

// listen (start app with node server.js) ======================================
module.exports = app.listen(port);
//console.log("App listening on port " + port);