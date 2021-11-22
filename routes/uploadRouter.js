//imports
const express = require('express');
const authenticate = require('../authenticate');
const multer = require('multer');

//Creates file storage with destination set to public/image and filename set to original name//
const storage = multer.diskStorage({
    //cb is short for callback//
    destination: (req, file, cb) => {
        //1st arg (null) means no error. 
        //2nd arg (public/images) is the path where we'll store our images if there's no error.//
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        //2nd arg (file.originalname) makes sure that the name of the file on the server is the SAME name as the file on the client side (upload)//
        //Note: If you don't set this arg, then Multer will automatically assign a random string for the file name.//
        cb(null, file.originalname);
    }
});

//Creates filter that rejects anything that isn't an image file (jpg/jpeg/png/gif).// 
const imageFileFilter = (req, file, cb) => {
    //If the file extension is NOT a jpg/jpeg/png/gif then console log error and reject upload. 
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        //2nd arg (false) tells Multer to reject upload.
        return cb(new Error('You can upload only image files!'), false);
    } else {
        //If no error with extension (null = no error), then accept the image upload (true).
        //2nd arg (true) tells Multer to acccept the image upload. 
        cb(null, true);
    }
}

//Configs the image file upload by setting storage and fileFilter//
const upload = multer({ storage: storage, fileFilter: imageFileFilter});

//creates router
const uploadRouter = express.Router();

//Configs uploadRouter to handle various HTTP requests//
uploadRouter.route('/')
.get(authenticate.verifyUser,authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('GET operation is not supported on /imageUpload')
})
.post(authenticate.verifyUser,authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    //upload.single('imageFile') -> means that we are expecting a single upload of a file whose input field's name is imageFile//
    //After this Multer takes over and checks for any errors before passing control to next middleware//
    //Since no error, status code 200
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    //Confirms to client that file(req.file) has been received correctly.//
    res.json(req.file);
})
.put(authenticate.verifyUser,authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /imageUpload')
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('DELETE operation is not supported on /imageUpload')
})


//exports uploadRouter
module.exports = uploadRouter;