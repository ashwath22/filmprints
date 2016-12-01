// need this for almost all apps
var express = require('express');
var app = express();
var router = express.Router();

//create new  client
// var contentful = require('contentful')
// var client = contentful.createClient({
//   // This is the space ID. A space is like a project folder in Contentful terms 
//   space: 'filmprints-website',
//   // This is the access token for this space. Normally you get both ID and the token in the Contentful web app 
//   accessToken: '2abdc50fa88530996ceac4fb4ad6f7c3271cc33bb3f6a11721d8d169c0459fa7'
// })
// // This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token. 
// client.getEntry('ey04yid3tpau')
// .then(function (entry) {
//   console.log(util.inspect(entry, {depth: null}))
// })

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

router.get('/', function(req, res) {
	res.render('home');
})

router.get('/contacts', function(req, res) {
	// will look for contacts.ejs file
	res.render('contacts');
})

router.get('/timeline', function(req, res) {
	// will look for contacts.ejs file
	client.get('/statuses/user_timeline', params, function(error, tweets, response){
		console.log(tweets);
		res.send(JSON.stringify(tweets));
	});
})


app.use('/', router);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
