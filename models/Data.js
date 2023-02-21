const mongoose = require('mongoose');


const dataSchema = new mongoose.Schema({
    codeArray: {
        type: [Number]
    }
});

const Data = mongoose.model('data', dataSchema);
module.exports = Data;