//Declaring only needed modules
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var http = require('http');
var path = require('path');
var errorHandler = require('errorhandler');
var app = express();
// Mongoose is a utility module to connect to MongoDB
var mongoose = require( 'mongoose' );
//You need to have an account created ib mongoose and use connect url directly
mongoose.connect('mongodb://username:password@ds053798.mongolab.com:53798/connectlink');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
console.log('connect');
});
//setting up static paths. Not required in this demo anyways this comes along with expressjs
app.use(express.static(__dirname + '/public'));
//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//all environments
app.set( 'port', process.env.PORT || 3000 );
app.engine('jade', require('jade').__express);
app.use( logger( 'dev' ));
app.use( cookieParser());
app.use( bodyParser.json());
app.use( bodyParser.urlencoded({ extended : true }));


//I am setting up a new model . You dont need to create a collection in database.
// Initialize a schema that is table structure 

var shoppingSchema = new mongoose.Schema({
    itemname: { type: String }
  , status: { type: String }
 	});
	
var Shop = mongoose.model('Shop', shoppingSchema);


//Routes

app.get('/create', function (req, res ){res.render('create');});

//read from database
app.get('/read' ,	
function (req, res ){
	var shop = new Shop({
		  itemname: req.body.itemname
		, status: 'Not Bought'
		});
	Shop.find({'status':'Not Bought' },function(err, items) {
		if (err) return console.error(err);
  		  console.dir(shop);
  		res.render('read', {items:items}); 
  		  }); 
}
);


app.post( '/create', 
		  function (req, res ){
				var shop = new Shop({
					  itemname: req.body.itemname
					, status: 'Not Bought'
					});
				shop.save(function(err, use) {
					if (err) return console.error(err);
			  	 		  res.render('message', {
			  			  message: 'New item added' 
			  				        });  
			  		  }); 
			}
		);

//login


	
		
		
		

app.post( '/update',function (req, res ){

	var query = {"itemname": req.body.itemname};
	var update = {"status":"Bought"};
	var options = { multi: true};
	Shop.findOneAndUpdate(query, update, options, function(err, result) {
		if (err) return console.error(err);
		  console.dir(result);
		  res.render('message', {
			  message: 'Item updated ' + result 
				        });  
		  });
});


app.post( '/delete',   
		function (req, res ){

			Shop.find({ itemname:req.body.itemname }).remove().exec(function callback (err, numAffected) {
				if (err) return console.error(err);
				  console.dir(numAffected);
				  res.render('message', {
					  message: 'Item updated ' + numAffected 
						        });  
				  });
			
			});
			  
			  
	


//eof login

app.all('*', function(req, res){
	  res.send('Page not found');
	});


http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});
