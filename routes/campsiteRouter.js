//Imports//
const express = require('express');
const Campsite = require('../models/campsite');

const campsiteRouter = express.Router();

//Chains all the GET,POST,PUT,DELETE requests for /campsites //
campsiteRouter.route('/')
.get((req, res, next) => {
    //Find() will query the database for all the documents that were created using the Campsite model.//
    Campsite.find()
    .then(campsites =>{
        //If successful, then run code below//
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //res.json() method will send json data to the client in the response stream and will automatically close the response stream afterwards. That's why we don't need to use res.end()//
        res.json(campsites);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    //Creates a new Campsite document and saves it to mongoDB server.//
    //Creates using the request body which contains info for the campsite to post from the client. Mongoose will automatically check to see if it fits the Campsite schema.//
    Campsite.create(req.body)
    .then (campsite => {
        //campsite contains information about the campsite the client posted//
        console.log('Campsite Created', campsite)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err));
   
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites');
})
.delete((req, res, next) => {
    //DELETES ALL THE CAMPSITES//
    Campsite.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


//Chains all the GET, POST, PUT, DELETE requests for /campsites/:campsiteId //
campsiteRouter.route('/:campsiteId')
.get((req, res, next) => {
    //Finds campsite by the id set by the client in req.params.campsiteId//
    Campsite.findById(req.params.campsiteId)
    .then (campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err =>next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation is not supported on /campsites/${req.params.campsiteId}`);
})
.put((req, res, next) => {
    Campsite.findByIdAndUpdate(req.params.campsiteId, 
        //Updates by using info from request body//
        { $set: req.body }, 
         //Set to true so we can get back information about the updated document.//
        { new: true }
    )
    .then (campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err));
})
.delete((req, res, next) =>{
    Campsite.findByIdAndDelete(req.params.campsiteId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//Exports campsiteRouter so it can be used elsewhere//
module.exports = campsiteRouter;