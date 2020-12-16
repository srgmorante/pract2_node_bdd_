const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    id: Number,
    title : String,
    summary : String,
    author : String,
    publisher : String,
    publicationYear : Number,
    comments : [
        {type: mongoose.Schema.Types.ObjectId,ref:'Comment'}
    ]
});

module.exports = mongoose.model('Book',bookSchema);