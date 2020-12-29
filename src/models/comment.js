const mongoose  = require('mongoose');

const CommentSchema = new mongoose.Schema({
    comment: String,
    score: Number,
    book :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Book'
    },
    user :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
});

module.exports = mongoose.model('Comment',CommentSchema);