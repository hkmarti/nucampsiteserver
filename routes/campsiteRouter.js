//Imports//
const express = require('express');
const Campsite = require('../models/campsite');
const authenticate = require('../authenticate');

const campsiteRouter = express.Router();

//** Chains for '/campsites' (all campsites)**//
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
.post(authenticate.verifyUser, (req, res, next) => {
    //Creates a new Campsite document and saves it to mongoDB server.//
    //Creates using the request body which contains info for the campsite to post from the client. Mongoose will automatically check to see if it fits the Campsite schema.//
    Campsite.create(req.body)
    .then (campsite => {
        //campsite contains information about the campsite the client posted//
        console.log('Campsite Created', campsite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err));
   
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    //DELETES ALL THE CAMPSITES//
    Campsite.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


//** Chains for '/campsites/:campsiteId' (selected campsite) **//
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
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation is not supported on /campsites/${req.params.campsiteId}`);
})
.put(authenticate.verifyUser, (req, res, next) => {
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
.delete(authenticate.verifyUser, (req, res, next) =>{
    Campsite.findByIdAndDelete(req.params.campsiteId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//** Chain for '/:campsiteId/comments' (all comments) **//
campsiteRouter.route('/:campsiteId/comments')
.get((req, res, next) => {
    //Find() documents by using the campsiteId//
    Campsite.findById(req.params.campsiteId)
    .then(campsite =>{
        if (campsite){
            //if campsite is found, return the following...//
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            //Returns the comments array for the campsite//
            res.json(campsite.comments);
        } else {
            //if campsite isn't found, return 404 error message...//
            err = new Error (`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            //Sends err to Express's error handling mechanism.//
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .then(campsite =>{
        if (campsite){
            //Push new comment from request body into the comments array//
            campsite.comments.push(req.body);
            //Save changes to mongoDB database//
            campsite.save()
            .then (campsite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite);
            })
           .catch (err => next(err));
        } else {
            //if campsite isn't found, return 404 error message...//
            err = new Error (`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /campsites/${req.params.campsiteId}/comments`);
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .then(campsite =>{
        if (campsite){
            //Deletes every comment in selected campsite's array//
            for (let i = (campsite.comments.length-1); i>=0; i--) {
                //Removes every comment by it's unique id//
                campsite.comments.id(campsite.comments[i]._id).remove();
            }
            campsite.save()
            .then (campsite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite);
            })
           .catch (err => next(err));
        } else {
            //if campsite isn't found, return 404 error message...//
            err = new Error (`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

//** Chain for '/:campsiteId/comments/:commentsId' (selected comment) **//
campsiteRouter.route('/:campsiteId/comments/:commentId')
.get((req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
        //if campsite and comment ids are found, return specific comment//
        if (campsite && campsite.comments.id(req.params.commentId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite.comments.id(req.params.commentId));
        //If campsite id is not found...//
        } else if (!campsite) {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        //If comment id is not found...//
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}/comments/${req.params.commentId}`);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
            //Updates any changes to rating//
            if (req.body.rating) {
                campsite.comments.id(req.params.commentId).rating = req.body.rating;
            }
            //Updates any changes to text//
            if (req.body.text) {
                campsite.comments.id(req.params.commentId).text = req.body.text;
            }
            campsite.save()
            .then(campsite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite);
            })
            .catch(err => next(err));
        } else if (!campsite) {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
            //Removes specific comment by their commentId//
            campsite.comments.id(req.params.commentId).remove();
            campsite.save()
            .then(campsite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite);
            })
            .catch(err => next(err));
        } else if (!campsite) {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

//Exports campsiteRouter so it can be used elsewhere//
module.exports = campsiteRouter;