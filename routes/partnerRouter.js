//Imports Express and Express Router//
const express = require('express');
const partnerRouter = express.Router();

//Chains all the GET,POST,PUT,DELETE requests for /partners //
partnerRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    //next function passes control of application routing to the next relevant routing method//
    next();
})
.get((req, res) => {
    res.end('Will send all the partners to you');
})
.post((req, res) => {
    res.end(`Will add the partner: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})
.delete((req, res) => {
    res.end('Deleting all partners');
});


//***BREAK*****//


//Chains all the GET, POST, PUT, DELETE requests for /partners/:partnerId //
partnerRouter.route('/:partnerId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    //next function passes control of application routing to the next relevant routing method//
    next();
})
.get((req, res) => {
    res.end(`Will send details of the partner: ${req.params.partnerId} to you`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation is not supported on /partners/${req.params.partnerId}`);
})
.put((req, res) => {
    res.write (`Updating partner: ${req.params.partnerId}\n`);
    res.end(`Will update partner: ${req.body.name} 
        with description: ${req.body.description}`);
})
.delete((req, res) =>{
    res.end(`Deleting partner: ${req.params.partnerId}`);
});


//Exports campsiteRouter so it can be used elsewhere//
module.exports = partnerRouter;