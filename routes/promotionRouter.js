//Imports Express and Express Router//
const express = require('express');
const promotionRouter = express.Router();

//Import Model//
const Promotion = require('../models/promotion');

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
.post((req, res, next) => {
   Promotion.create(req.body)
   .then (promotion => {
        console.log('Promotion Created', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
   })
   .catch(err => next(err));
})
.put((req, res) => {
    //PUT operation not supported    
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) => {
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
.post((req, res) => {
    //POST NOT SUPPORTED//
    res.statusCode = 403;
    res.end(`POST operation is not supported on /promotions/${req.params.promotionId}`);
})
.put((req, res, next) => {
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
.delete((req, res, next) =>{
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