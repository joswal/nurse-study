const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    quiz_id: {
        type: String,
        required: true
    },
    scores: {
        type: Array,
        required: true
    },
    created_on: {
        type: Date,
        default: Date.now,
    }
});

const Result = mongoose.model('Result', resultSchema);

exports.Result = Result;