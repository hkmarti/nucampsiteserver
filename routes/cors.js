//import
const cors = require('cors');

//sets up whitelist
const whitelist = ['http://localhost:3000', 'https://localhost:3443'];


const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    //Checks to see if req.header('Origin') is part of the whitelist array.//
    //Note: if indexOf is -1 it means not found. So if it's not -1, then it's found req.header('Origin') in the whitelist//
    if (whitelist.indexOf(req.header('Origin')) !== -1){
       //if req.header('Origin') is part of whitelist, then set origin to TRUE. Request is accepted.//
        corsOptions = { origin: true };
    //Otherwise, set corsOptions to FALSE. Request is rejected.//
    } else {
        corsOptions = { origin: false };
    }
    //null -> no error has occurred.//
    callback(null, corsOptions)
}

//exports cors middleware function. //
//when cors() is called, it will return a middleware function configure to set a cors header of 'access-control-allow-origin' on a response object with a wildcard as its value. The wildcare value means it will allow cors for all origins.//
exports.cors = cors();

//exports corsWithOptions//
//This will check to see if the incoming request belongs to one of the whitelisted origins. If part of whitelist, it will send back the cors response header of 'access-control-allow-origin with whitelisted origin as the value.//
exports.corsWithOptions = cors(corsOptionsDelegate);