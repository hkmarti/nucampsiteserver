//Imports Express and Express Router//
const express = require('express');
const promotionRouter = express.Router();

//Import Model//
const Promotion = require('../models/promotion');
const authenticate = require('../authenticate');

//** Chains for '/promotions' (all promotions) **//
promotionRouter.route('/')
.get((req, res, next) => {
    Promotion.find()
    .then(promotions =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
   Promotion.create(req.body)
   .then (promotion => {
        console.log('Promotion Created', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
   })
   .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    //PUT operation not supported    
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    //Deletes ALL promotions//
    Promotion.deleteMany()
    .then (response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err)); 
});


//***BREAK*****//


//** Chains for '/promotions/:promotionId' **//
promotionRouter.route('/:promotionId')
.get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then (promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
    //POST NOT SUPPORTED//
    res.statusCode = 403;
    res.end(`POST operation is not supported on /promotions/${req.params.promotionId}`);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    //Updates promotion by specific id//
    Promotion.findByIdAndUpdate(req.params.promotionId,
        //Updates by using info from request body//
        { $set: req.body },
        //Set to true so we can get back info abt updated document//
        { new: true }
    )
    .then (promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })  
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    //Deletes specific promotion by id//
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then (response =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//Exports promotionRouter//
module.exports = promotionRouter;