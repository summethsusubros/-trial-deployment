const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  version:  { type : Array , "default" : [] },
  
  owner: {
    type: [mongoose.Schema.Types.ObjectId],
  }
});


const Product = mongoose.model('product', productSchema);
module.exports = Product;