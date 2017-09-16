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

var db

//database connection
//u: admin
//p: admin
//url: mongodb://admin:admin@ds135514.mlab.com:35514/plantir-db
MongoClient.connect('mongodb://admin:admin@ds135514.mlab.com:35514/plantir-db', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, function () {
    console.log('Plantir active on port 3000!');
  });
})

//homepage
app.get('/', function (req, res) {
  db.collection('tiles').find().toArray((err, result) => {
    if (err) return console.log(err)
   
    // renders index.ejs
    res.render('index.ejs', {tiles: result})
  })
  //res.sendFile(__dirname + '/index.html')

});

//create new garden token
app.get('/create', function (req, res) {

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

//edit current tile
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

app.set('view engine', 'ejs')

// app.listen(3000, function () {
//   console.log('Plantir active on port 3000!');
// });

