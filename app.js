
/**
 * Module dependencies.
 */

var express = require('express');
var db = require('./db.js');
var user = require('./routes/user');
var activities = require('./routes/activities');
var http = require('http');
var path = require('path');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({ keepExtensions: true}));
app.use(express.methodOverride());
app.use(express.cookieParser('teamdsk'));
app.use(express.session({ secret: 'teamdsk2013' }));
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function authorize(req, res, next) {
	if ( req.session.userid ) {
		next();
	} else {
		res.redirect('/');
	}
}

var dir = __dirname;

// =======================================
//	START ROUTES 
// ======================================= 

app.get('/', function(req, res) {
	res.render('login', { title: 'Login' });
});

// Login/Logout User --------------------------

app.get('/login', function(req, res) {
	res.render('login', { title: 'Login' });
});

app.post('/user/login', user.login);


app.get('/logout',function( req, res ) {
	req.session.destroy();
	res.redirect('/');
});

// User -----------------------------------------

app.get('/user/dashboard', authorize, user.dashboard);


// Activities --------------------------

app.get('/activities/:category', authorize, activities.index);
app.get('/activities/details/:id', authorize, activities.details);
app.get('/activities/complete/:id', authorize, activities.complete);
app.post('/activities/complete/:id', authorize, activities.completeActivity);


// Images --------------------------

app.get('/files/:name', activities.photo);


// =======================================
//	RUN SERVER
// ======================================= 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
