const mongoose = require('mongoose');

const MusicSchema = mongoose.Schema({
    featured_img: {
        type: String,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    band_name: {
        type: String,
        require: true,
    },
    audio: {
        type: String,
        require: true,
    },
    added_on: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('music', MusicSchema);