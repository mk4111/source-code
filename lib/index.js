var Authentication = require('./authentication.js');
var ClientAuthentication = require('./client_authentication');
var Assets = require('./assets.js');
var Api = require('./api.js');
var CandidateView = require('./candidateView.js');
var Connected = require('./connected.js');
var ClientUsers = require('./client_users');
var Email = require('./email.js');
var Favourite = require('./favourite');
var Hapi = require('hapi');
var Analytics = require('./analytics.js');
var Candidates = require('./candidates.js');
var Countries = require('./countries.js');
var Clients = require('./clients.js');
var Cv = require('./cv.js');
var Owners = require('./owners.js');
var Handlebars = require('handlebars');
var Jobs = require('./jobs.js');
var Login = require('./login');
var Inert = require('inert');
var Sectors = require('./sector_business.js');
var Query = require('./query.js');
var Search = require('./search.js');
var Vision = require('vision');
var HapiAuthGoogle = require('hapi-auth-google');
var Permission = require('./permission');
var Delete = require('./delete');
var Activities = require('./activities');
var Status = require('./status');
var Info = require('./info');
var Li = require('./li');
var Users = require('./users');
var Dashboard = require('./dashboard');
var Notes = require('./notes');
var LoginClient = require('./login_client');
var ClientDashboard = require('./client_dashboard');
var HapiAuthJWT =  require('hapi-auth-jwt2');
var CsvList = require('./csv_list');
var Calls = require('./calls');
var Yar = require('yar');


// @speedingdeer: it's not safe to keep it here but it's kind of comprise
// the tests code isn't well structure, it's dissifult to ensure the connection is either open only once
// or it's correctly close after each test.
// the best is to move within server init method and reorganize tests, add some convetion etc. 
// It's a big reafactor task, probalby there is no time for that and we don't know if it will ever be.

const Mongoose = require('mongoose');
Mongoose.Promise = require('bluebird');

Mongoose.connect(process.env.MONGO_URI, { db: { safe: true } });
    Mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

exports.init = function (port, next) {

  var server = new Hapi.Server();
  server.connection({port: port});

  var scopes = [
    'https://www.googleapis.com/auth/plus.profile.emails.read',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/gmail.send'
  ];

  var opts = {
    REDIRECT_URL: '/googleauth',
    scope: scopes,
    handler: require('./google_oauth_handler.js')
  };

  var plugins = [
    HapiAuthJWT,
    {register: HapiAuthGoogle, options: opts},
    Authentication,
    ClientAuthentication,
    Inert,
    Vision,
    Analytics,
    CandidateView,
    Connected,
    Cv,
    Email,
    Assets,
    Api,
    Candidates,
    Countries,
    Owners,
    Clients,
    ClientUsers,
    Sectors,
    Query,
    Search,
    Jobs,
    Login,
    Permission,
    Favourite,
    Delete,
    Activities,
    Dashboard,
    Status,
    Info,
    Li,
    Users,
    Notes,
    LoginClient,
    ClientDashboard,
    CsvList,
    Calls,
    { register: Yar, options: { cookieOptions:  { password: ",N{5&&]7J6*</#-9!ckD'EE7Kdu?DXz#Ft{:;<[.-8s", isSecure: false } } },
  ];
  server.register(plugins, function (err) {
     // $lab:coverage:off$
    if (err) {
      return next(err);
    }
    // $lab:coverage:on$

    server.views({
      engines: {
        html: Handlebars
      },
      relativeTo: __dirname + '/../views/',
      path: '.',
      layout: 'default',
      layoutPath: 'layout',
      helpersPath: 'helpers',
      partialsPath: 'partials'
    });

    server.start(function (err) {

      return next(err, server);
    });
  });
};
