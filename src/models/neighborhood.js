const mongoose  = require('mongoose');

const NeighborhoodSchema = new mongoose.Schema({
    name: String,
    geometry: Array,
});

module.exports = mongoose.model('Neighborhood', NeighborhoodSchema);