const mongoose = require('mongoose');


// New set of rules for our data
const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String, 
    email: String, 
    password: String
})

module.exports = mongoose.model('User', userSchema);