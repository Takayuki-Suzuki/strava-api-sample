var express = require('express'),
	request = require('request'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	app = express();


app.use(express.static(__dirname + '/../public'));
app.set('views', __dirname + '/../public');
app.set('view engine', 'ejs');
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/getSettings', function(req, res, next){
	res.json({
		REDIRECT_URI: process.env.REDIRECT_URI,
		CLIENT_ID: process.env.CLIENT_ID,
		// CLIENT_SECRET: process.env.CLIENT_SECRET, 
		// ACCESS_TOKEN: process.env.ACCESS_TOKEN
	})
});
app.get('/login_callback', function(req, res, next){
	var options = {
		uri: 'https://www.strava.com/oauth/token',
		form: { 
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
			code: req.query.code
		},
		json: true
	};

	request.post(options, function(error, response, body){
		if (!error && response.statusCode == 200) {
			// access_tokenクッキー付与
			res.append('Set-Cookie', 'access_token=' + body.access_token + '; Path=/;');
		} else {
			// TODO エラー処理
			console.log('error: '+ response.statusCode);
		}
		res.render('index.ejs', { root: __dirname + '/../public' });
	});
});
app.all('/*', function(req, res, next) {
    // To support HTML5Mode
    res.render('index.ejs', { root: __dirname + '/../public' });
});

app.listen( process.env.PORT || 3000);
