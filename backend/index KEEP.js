// ************************** start of what we need to get BE running


// pull in express into the b/e - allows you to write server queries in js
const express = require('express');
// sets variable of 'app' to use the js express method
const app = express();

// set up CORS - cross origin requests - FE and BE have different addresses so need to use CORS
const cors = require('cors');

// bring in body parser - talking js to json and json to js
const bodyParse = require('body-parser');

// bring in mongoose - FE can talk to mongo - middleware - need it to talk to mongo
const mongoose = require('mongoose');

// config.json holds all your sensitive data
const config = require('./config.json');

// schema for the products collection
const Product = require('./models/product');

// now set up port for our local server - ie this is the port our BE will live on
const port = 8081;

// Now start off the server

// call upon express - anytime express is being used want to pass t
app.use((req, res, next) => {
    // which method has been sent and where has it been sent to
    console.log(`${req.method} request ${req.url}`);
    next();
})

// Whenever you use express use the CORS method
app.use(cors());

// sent to BE on request - use express at this endpoint 
app.get('/', (req, res) => res.send('hello from the backend'));

// Set up mongoose connection to mongoDB
mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@cluster0.${config.MONGO_CLUSTER_NAME}.mongodb.net/${config.MONGO_DBNAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('DB connected'))
.catch(err => {
    console.log(`DB connection error: ${err.message}`);
})


// while using express want to list to port and go into arrow function and ...
// sent to nodemon
app.listen(port, () => console.log(`my fullstack app is listening on port ${port}`));

// ************************** end of what we need to get BE running

// ------ PRODUCT END POINTS

// Get all products from the DB endpoint. Use Express to do this. the 'get' bit is saying to use the GET method
// We are creating the place from where we want to get the info from

app.get('/allProductsFromDB', (req, res) => {
    Product.find().then(result => {
        res.send(result)
    })
})