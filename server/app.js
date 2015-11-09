const STRAVA_HOST = 'https://www.strava.com';
const STRAVA_API_BASE = STRAVA_HOST + '/api/v3';

var express = require('express'),
	request = require('request'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	multer  = require('multer'),
	fs  = require('fs'),
	upload = multer({ dest: __dirname + '/../tmp/uploads/' }),
	app = express();

app.set('views', __dirname + '/../public');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(session({
  secret: 'StravaApp',
  resave: false,
  saveUninitialized: false
}));
app.all('/athletes/*?', function(req, res, next){
	res.contentType('json');
	next();
});
app.all('/activities/*?', function(req, res, next){
	res.contentType('json');
	next();
});

app.get('/settings', function(req, res, next){
	res.contentType('json');
	res.send({
		REDIRECT_URI: process.env.REDIRECT_URI,
		CLIENT_ID: process.env.CLIENT_ID,
		// CLIENT_SECRET: process.env.CLIENT_SECRET, 
		// ACCESS_TOKEN: process.env.ACCESS_TOKEN
	})
});
app.get('/currentUser', function(req, res, next){
	// console.log(req.session.currentUser);
	res.contentType('json');
	if(req.session.currentUser){
		res.status(200).json({
			data: req.session.currentUser
		});
	} else {
		res.status(200).send({data: null});
	}
});
app.get('/authCallback', function(req, res, next){
	var options = {
		uri: STRAVA_HOST + '/oauth/token',
		form: { 
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
			code: req.query.code
		},
		json: true
	};

	request.post(options, function(error, response, body){
		if (!error && response.statusCode == 200) {
			// access_tokenセッション付与
			req.session.access_token = body.access_token;
			req.session.currentUser = body.athlete;
		} else {
			// TODO エラー処理
			console.log('error: '+ response.statusCode);
		}
		res.redirect('/');
	});
});
app.post('/logout', function(req, res, next){
	var options = {
		uri: STRAVA_HOST + '/oauth/deauthorize',
		headers: {
			'Authorization': 'Bearer ' + req.session.access_token
		}
	};

	request.post(options, function(error, response, body){
		if (!error && response.statusCode == 200) {
			// セッション破棄
			req.session.destroy();
    		res.clearCookie('connect.sid', { path: '/' });
		} else {
			// TODO エラー処理
			console.log('error: '+ response.statusCode);
		}
		res.contentType('json');
		res.status(response.statusCode)
		.send(JSON.parse(response.body));
	});
});
app.get('/athletes', function(req, res, next){
	// console.log(req.session.currentUser);
	var options = {
		uri: STRAVA_API_BASE + '/athletes/' + req.session.currentUser.id,
		headers: {
			'Authorization': 'Bearer ' + req.session.access_token
		}
	};
	request.get(options, function(error, response, body){
		// if(response.statusCode == 401){
		// 	response.statusCode = 200
		// }
		res.status(response.statusCode)
		.send(JSON.parse(body));
	});
});
app.get('/activities', function(req, res, next){
	var options = {
		uri: STRAVA_API_BASE + '/athlete/activities',
		form: {
			page: req.query.page,
			per_page: req.query.per_page
		},
		headers: {
			'Authorization': 'Bearer ' + req.session.access_token
		}
	};
	request.get(options, function(error, response, body){
		res.status(response.statusCode)
		.send(JSON.parse(response.body));
	});
});
app.get('/activities/:id', function(req, res, next){
	var options = {
		uri: STRAVA_API_BASE + '/activities/' + req.params.id,
		headers: {
			'Authorization': 'Bearer ' + req.session.access_token
		}
	};
	request.get(options, function(error, response, body){
		res.status(response.statusCode)
		.send(JSON.parse(response.body));
	});
});
app.get('/activities/:id/zones', function(req, res, next){
	var options = {
		uri: STRAVA_API_BASE + '/activities/' + req.params.id + '/zones',
		headers: {
			'Authorization': 'Bearer ' + req.session.access_token
		}
	};
	request.get(options, function(error, response, body){
		res.status(response.statusCode)
		.send(JSON.parse(response.body));
	});
});
app.get('/activities/:id/laps', function(req, res, next){
	var options = {
		uri: STRAVA_API_BASE + '/activities/' + req.params.id + '/laps',
		headers: {
			'Authorization': 'Bearer ' + req.session.access_token
		}
	};
	request.get(options, function(error, response, body){
		res.status(response.statusCode)
		.send(JSON.parse(response.body));
	});
});
app.get('/activities/:id/streams/:type', function(req, res, next){
	var seriesType = req.query.seriesType ? req.query.seriesType : 'time';
	var options = {
		uri: STRAVA_API_BASE + '/activities/' + req.params.id + '/streams/' + req.params.type,
		form: {
			resolution: 'medium',
			series_type: seriesType
		},
		headers: {
			'Authorization': 'Bearer ' + req.session.access_token
		}
	};
	request.get(options, function(error, response, body){
		res.status(response.statusCode)
		.send(JSON.parse(response.body));
	});
});
app.post('/uploads', upload.fields([{name: 'fit'}, {name: 'activity_type'}]), function(req, res, next){
	var options = {
		uri: STRAVA_API_BASE + '/uploads',
		headers: {
			'Authorization': 'Bearer ' + req.session.access_token
		},
		formData: {
			file: {
				value:  fs.createReadStream(req.files.fit[0].path),
			    options: {
			      filename: req.files.fit[0].originalname
			    }
			},
			activity_type: req.body.activity_type,
			data_type: 'fit'
		}
	};
	request.post(options, function(error, response, body){
		// tmpファイルの削除
		fs.unlink(req.files.fit[0].path, function (err) {
			if (err) throw err;
		});
		res.contentType('json');
		res.status(response.statusCode)
		.send(JSON.parse(response.body));
	});
});
app.all('/*', function(req, res, next) {
    // To support HTML5Mode
    res.render('index.ejs', { root: __dirname + '/../public' });
});

app.listen( process.env.PORT || 3000);
