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
var Home = require('./home.js');
var Handlebars = require('handlebars');
var Jobs = require('./jobs.js');
var Login = require('./login');
var Inert = require('inert');
var Sectors = require('./sector_business.js');
var Query = require('./query.js');
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

const Mongoose = require('mongoose');
Mongoose.Promise = require('bluebird');

exports.init = function (port, next) {

    // must go like this for now otherwise the test will not stand up
    Mongoose.connect(process.env.MONGO_URI, { db: { safe: true } });
    Mongoose.connection.on('error', function(err) {
      console.error('MongoDB connection error: ' + err);
      process.exit(-1);
    });


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
    Home,
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
    CsvList
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
