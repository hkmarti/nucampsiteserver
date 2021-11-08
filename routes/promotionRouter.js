//Imports Express and Express Router//
const express = require('express');
const promotionRouter = express.Router();

//Chains all the GET,POST,PUT,DELETE requests for /promotions //
promotionRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    //next function passes control of application routing to the next relevant routing method//
    next();
})
.get((req, res) => {
    res.end('Will send all the promotions to you');
})
.post((req, res) => {
    res.end(`Will add the promotion: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res) => {
    res.end('Deleting all promotions');
});


//***BREAK*****//


//Chains all the GET, POST, PUT, DELETE requests for /promotions/:promotionId //
promotionRouter.route('/:promotionId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    //next function passes control of application routing to the next relevant routing method//
    next();
})
.get((req, res) => {
    res.end(`Will send details of the promotion: ${req.params.promotionId} to you`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation is not supported on /promotions/${req.params.promotionId}`);
})
.put((req, res) => {
    res.write (`Updating promotion: ${req.params.promotionId}\n`);
    res.end(`Will update promotion: ${req.body.name} 
        with description: ${req.body.description}`);
})
.delete((req, res) =>{
    res.end(`Deleting promotion: ${req.params.promotionId}`);
});

//Exports promotionRouter//
module.exports = promotionRouter;