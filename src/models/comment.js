const mongoose  = require('mongoose');

const CommentSchema = new mongoose.Schema({
    comment: String,
    score: Number,
    book :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Book'
    }
});

module.exports = mongoose.model('Comment',CommentSchema);