//project accounts
//email: sengplantir@gmail.com
//passw: sengplantir123
//
//url: mongodb://admin:admin@ds135514.mlab.com:35514/plantir-db
//u: admin
//p: admin


var express = require('express');
var app = express();
var mongo = require('mongodb');
var bodyParser= require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

//react
// var React = require('react');
// var ReactDOM = require('react-dom');
// var App = require('./components/App');


//middleware
app.use(bodyParser.urlencoded({extended: true}))

var db;

//database connection
MongoClient.connect('mongodb://admin:admin@ds135514.mlab.com:35514/plantir-db', (err, database) => {
  if (err) return console.log(err)
  db = database
  //only accept connections when the DB is connected
  app.listen(3000, function () {
    console.log('Plantir active on port 3000!');
  });
})

//homepage
app.get('/', function (req, res) {
  // db.collection('tiles').find().toArray((err, result) => {
  //   if (err) return console.log(err)
   
  //   // renders index.ejs
  //   res.render('index.ejs', {tiles: result})
  // })
  res.render('home.ejs');
  //res.sendFile(__dirname + '/index.html')

});

//create new garden token
app.post('/create', function (req, res) {

  //get grass tiletype _id
  var grassId = "Grass tile not found";
  // db.collection('tiletypes').find({name:"Grass"}).toArray((err, result) => {
  //   if (err) return console.log(err);
  //   console.log(result._id);
  //   grassId = result._id;
  // })


  //var grassid = ObjectId("59be0f68be5c7140cab1abfd");
  //***NEEDS TO BE FIXED***
  //var tiletype = db.collection('tiletypes').find({ "_id": ObjectId("59be0f68be5c7140cab1abfd")}).toArray();
  //console.log(tiletype);
  grassId = "59be0f68be5c7140cab1abfd";

  var generatedToken = new ObjectId();
  var generatedURL = "/garden/" + generatedToken.valueOf();
  console.log(generatedURL);

  //sunlight = None | Low | Moderate | High
  //pH balance => 5 > x > 8
  //soil type: Sandy | Silty | Clay | Peaty | Loam
  //moisture : None | Low | Moderate | High | Waterlogged
  var newTile = {
  	_id: generatedToken.valueOf(),
  	tiletype: "Grass",
    tiletypeid: grassId,
  	properties: {
  		ph: "6.5",
  		sunlight: "Moderate",
  		moisture: "Moderate",
  		type: "Loam"
  	}
  }
 
  db.collection('tiles').save(newTile);
   
  // renders index.ejs
  //res.render('home.ejs', {tiles: result})
  res.redirect(generatedURL);
  //res.sendFile(__dirname + '/index.html')
});

//find an existing token with validation
app.post('/findtoken', function (req, res) {

  var generatedToken = new ObjectId();
  var generatedURL = "/garden/" + generatedToken.valueOf();
  console.log(generatedURL);
  var newTile = {
  	_id: generatedToken.valueOf(),
  	name: "Grass",
  	info: "Non-plant tile."
  }
 
  db.collection('tiles').save(newTile);
   
  // renders index.ejs
  //res.render('home.ejs', {tiles: result})
  res.redirect(generatedURL);
  //res.sendFile(__dirname + '/index.html')
});

//hardcoded url for testing purposes
app.get('/123', function (req, res) {
  //find specific
  db.collection('tiles').find( { _id: ObjectId("59ba67be4320eb2cfe615d03")}).toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {tiles: result})
  })

});

//custom url
app.get('/garden/:gardenId', function (req, res) {
  
  //get garden token from url
  var gardenIdParam = req.params.gardenId;
  //console.log(gardenIdParam);

  //create ObjectId
  var gardenObjectId = ObjectId(gardenIdParam);

  //find specific tile | example 59ba67be4320eb2cfe615d03
  db.collection('tiles').find({_id: gardenObjectId}).toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {tiles: result})
  })

});

//change tile type
app.post('/changetiletype', (req, res) => {

  //db.collection('tiletypes').find({name:"Grass"}).toArray((err, result) => {

  //get id from prev url
  var gardenPath = req.body.gardenid;
  var idPattern = /garden\/([a-zA-Z0-9]+)/;
  //console.log(idPattern.exec(gardenId)[1])
  var gardenObjectId = ObjectId(idPattern.exec(gardenPath)[1]);
  //console.log(req.body.gardenid);

  var newTypeName = req.body.tiletype;
  var newTypeId = "Not found";
  var newType = [];

  //this is to deal with the asynchronous way database searching happens,
  //need to make a callback function that essentially executes after
  //the query takes place
  function queryForTileType(collection, callback) {
  	collection.find({ name: newTypeName}).toArray((err, result) => {
  		if (err) {
  			console.log(err);
  		} else if (result.length > 0) {
  			newType = result;
  			callback();
  		}
  	})
  }

  queryForTileType(db.collection('tiletypes'), function() {
  		console.log(newType[0]);
  		newTypeId = newType[0]._id;
  		if (newTypeName != "") {
    		//db.collection('tiles').update( {"_id": ObjectId("59ba67be4320eb2cfe615d03")}, { $set: { name: newName}} );
    		db.collection('tiles').update( {"_id": gardenObjectId}, { $set: { tiletype: newTypeName, tiletypeid: newTypeId }} );
  		}

  		console.log("Updated DB");
  		//redirect back to same id page
  		res.redirect(gardenPath);
  })
})

//edit current tile
//OLD
app.post('/edit', (req, res) => {

  //add entry
  // db.collection('tiles').save(req.body, (err, result) => {
  //   if (err) return console.log(err)

  //   console.log('saved to database')
  //   res.redirect('/')
  // })

  var newName = req.body.name;
  var newInfo = req.body.info;

  //get id from prev url
  var gardenPath = req.body.gardenid;
  var idPattern = /garden\/([a-zA-Z0-9]+)/;
  //console.log(idPattern.exec(gardenId)[1])
  var gardenObjectId = ObjectId(idPattern.exec(gardenPath)[1]);
  //console.log(req.body.gardenid);


  if (newName != "") {
    //db.collection('tiles').update( {"_id": ObjectId("59ba67be4320eb2cfe615d03")}, { $set: { name: newName}} );
    db.collection('tiles').update( {"_id": gardenObjectId}, { $set: { name: newName}} );
  }

  if (newInfo != "") {
    db.collection('tiles').update( {"_id": gardenObjectId}, { $set: { info: newInfo}} );
  }

  console.log("Updated DB");

  //redirect back to same id page
  res.redirect(gardenPath);
})



//generate basic tile types
app.get('/generate-starter-tiles', function (req, res) {

  //grass tile
  var generatedToken = new ObjectId();
  var newTile = {
  	_id: generatedToken.valueOf(),
  	name: "Grass",
  	altname: "",
  	isPlant: false,
  	info: "Your beautiful lawn",
  	tilecolour: "64C949",
  	requirements: {
  		watering: "Not required",
  		blossom: "N/A",
  		ph: "Between 5.5 and 5.5",
  		sunlight: "Moderate",
  		moisture: "Low",
  		soiltype: "Any"
  	}
  }
  //db.collection('tiletypes').save(newTile);

  //house tile
  generatedToken = new ObjectId();
  newTile = {
  	_id: generatedToken.valueOf(),
  	name: "House",
  	altname: "",
  	isPlant: false,
  	info: "Hopefully yours",
  	tilecolour: "FF6A19",
  	requirements: {
  		watering: "Not required",
  		blossom: "N/A",
  		ph: "N/A",
  		sunlight: "N/A",
  		moisture: "N/A",
  		soiltype: "N/A"
  	}
  }
  //db.collection('tiletypes').save(newTile);

  //sunflower tile
  generatedToken = new ObjectId();
  newTile = {
  	_id: generatedToken.valueOf(),
  	name: "Sunflower",
  	altname: "Helianthus Annuus",
  	isPlant: true,
  	info: "Sow in garden. Sow seed at a depth approximately three times the diameter of the seed. Best planted at soil temperatures between 10°C and 30°C",
  	tilecolour: "FF6A19",
  	requirements: {
  		watering: "Weekly",
  		blossom: "Mid-summer to early-autumn",
  		ph: "Between 6.4 and 7.7",
  		sunlight: "High",
  		moisture: "Moderate",
  		soiltype: "Any"
  	}
  }
  //db.collection('tiletypes').save(newTile);
   
  res.redirect("/");
});


app.set('view engine', 'ejs')

// app.listen(3000, function () {
//   console.log('Plantir active on port 3000!');
// });

