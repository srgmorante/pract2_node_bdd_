const mongoose  = require('mongoose');

const UserSchema = new mongoose.Schema({
    nick: String,
    mail: String,
    comments :[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

module.exports = mongoose.model('User',UserSchema);