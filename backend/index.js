// pull in express into the b/e
const express = require('express');
// sets variable of 'app' to use the js express method
const app = express();

// set up CORS
const cors = require('cors');

// bring in body parser
const bodyParse = require('body-parser');

// bring in mongoose
const mongoose = require('mongoose');

// bring in bcrypt to encrypt the password
const bcrypt = require('bcryptjs');

const config = require('./config.json');
const Product = require('./models/product');
const User = require('./models/user');
const bodyParser = require('body-parser');
// const product = require('./models/product');

// now set up port for our local server 
const port = 8081;

// Now start off the server

// call upon express
app.use((req, res, next) => {
    // which method has been sent and where has it been sent to
    console.log(`${req.method} request ${req.url}`);
    next();
})

app.use(bodyParser.json()); // calling Body Parser method to stringify or parse
// next line says not to bodyparse the url
app.use(bodyParser.urlencoded({
    extended: false
}));

// Whenever you use express use the CORS method
app.use(cors());

// sent to BE on request
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


// ------ PRODUCT END POINTS
// Get all products from the DB endpoint

app.get('/allProductsFromDB', (req, res) => {
    Product.find().then(result => {
        res.send(result)
    })
})

// Post method to CREATE a product

// 1. Call on Express and calling the endpoint addProduct

app.post('/addProduct', (req, res) => {
    const dbProduct = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price,
        img_url: req.body.img_url,
        user_id: req.body.user_id
    });
    dbProduct.save().then(result => {
        res.send(result);
    }).catch(err => res.send(err))
})

// Endpoint for an edit or UPDATE a product using PATCH http method

app.patch('/updateProduct/:id', (req, res) => {
    const idParam = req.params.id;
    Product.findById(idParam, (err, product) => {
        const updatedProduct = {
            name: req.body.name,
            price: req.body.price,
            img_url: req.body.img_url,
        }
        Product.updateOne({
            _id: idParam
        }, updatedProduct).
        then(result => {
            res.send(result);
        }).catch(err => res.send(err))
    })
})

// Endpoint for a DELETE http method
app.delete('/deleteProduct/:id', (req, res) => {
    const idParam = req.params.id;
    Product.findOne({
        _id: idParam
    }, (err, product) => {
        if (product) {
            Product.deleteOne({
                _id: idParam
            }, err => {
                console.log('Deleted on backend request');
            });
        } else {
            alert('not found so cannot delete it')
        }
    }).catch(err => res.send(err)); // this is the error if can't get into DB in first
});





// -------------------------- USER ENDPOINTS ---------------------------


// REGISTER USER

app.post('/registerUser', (req, res) => {
    User.findOne({
        username: req.body.username,
    }, (err, userExists) => {
        if (userExists) {
            res.send('username already exists');
        } else {
            const hash = bcrypt.hashSync(req.body.password);
            const user = new User({
                _id: new mongoose.Types.ObjectId,
                username: req.body.username,
                password: hash,
                email: req.body.email
            });
            user.save()
                .then(result => {
                    console.log((user, result));
                    res.send(result);
                }).catch(err => {
                    res.send(err);
                });
        } // else
    })  // findone
})  // end of register

// End of REGISTER USER


// LOG IN User

app.post('/loginUser', (req, res) => {
    User.findOne({username: req.body.username}, (err, userResult) => {
        if (userResult) {
            if (bcrypt.compareSync(req.body.password, userResult.password)) {
                res.send(userResult);
            } else {
                res.send('Not authorised');
            } // inner if ends
        } else {
            res.send('User not found - please register')
        } // outer if ends
    }) // find one ends
}) // end of post for login

// End of LOG IN User
