const mongoose = require('mongoose');


// New set of rules for our data
const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String, 
    price: Number, 
    img_url: String,
    comment:[],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

// the productSchema (list of field names and the tdata type) represents the items in a single Product (record)
module.exports = mongoose.model('Product', productSchema);