//Imports Express and Express Router//
const express = require('express');
const partnerRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

//Import Model//
const Partner = require('../models/partner');

//**Chains for '/partners' (all partners) **//
partnerRouter.route('/')
.options(cors.corsWithOptions, (req,res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    //Finds all partners//
    Partner.find()
    .then (partners => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);
    })
    .catch (err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    //Creates a new Partner document and saves it to mongoDB server.//
    Partner.create(req.body)
    .then(partner => {
        console.log('Partner Created', partner);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch (err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    //PUT operation is not supported//
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    //Deletes ALL Partners//
    Partner.deleteMany()
    .then (response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


//***BREAK*****//


//** Chains for  '/partners/:partnerId' **//
partnerRouter.route('/:partnerId')
.options(cors.corsWithOptions, (req,res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    //Finds partner by id//
    Partner.findById(req.params.partnerId)
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    //POST NOT SUPPORTED//
    res.statusCode = 403;
    res.end(`POST operation is not supported on /partners/${req.params.partnerId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    //Updates partner by id//
    Partner.findByIdAndUpdate(req.params.partnerId,
        //Updates by using info from request body//
        { $set: req.body },
        //Set to true so we can get back info abt updated document//
        { new: true }
    )
    .then (partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })  
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    //Deletes specific partner by id//
    Partner.findByIdAndDelete(req.params.partnerId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//Exports campsiteRouter so it can be used elsewhere//
module.exports = partnerRouter;