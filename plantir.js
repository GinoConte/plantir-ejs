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

//handlers
app.get('/', function (req, res) {
  db.collection('tiles').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {tiles: result})
  })
  //res.sendFile(__dirname + '/index.html')

  // db.collection('plants').find().toArray(function(err, results) {
  //   console.log(results)
  // // send HTML file populated with quotes here
  // })

});

//sample code
app.get('/123', function (req, res) {
  //find specific
  db.collection('tiles').find( { _id: ObjectId("59ba67be4320eb2cfe615d03")}).toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {tiles: result})
  })

  //console.log(db.collection('tiles').find( { _id: ObjectId("59ba67be4320eb2cfe615d03")}).toArray());

  //res.sendFile(__dirname + '/index.html')

  // db.collection('plants').find().toArray(function(err, results) {
  //   console.log(results)
  // // send HTML file populated with quotes here
  // })
});

app.post('/edit', (req, res) => {
  //add entry
  // db.collection('tiles').save(req.body, (err, result) => {
  //   if (err) return console.log(err)

  //   console.log('saved to database')
  //   res.redirect('/')
  // })
  // console.log(req.body);
  // db.collection('tiles').update(req.body, (err, result) => {
  //   if (err) return console.log(err)

  //   console.log('saved to database')
  //   res.redirect('/')
  // })


  //console.log(req.body)
})

app.set('view engine', 'ejs')

// app.listen(3000, function () {
//   console.log('Plantir active on port 3000!');
// });

