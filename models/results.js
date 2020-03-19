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
    section_id: {
        type: String,
        required: true
    },
    score: {
        type: String,
        required: true,
    },
    created_on: {
        type: Date,
        default: Date.now,
    }
});

const Result = mongoose.model('Result', resultSchema);

exports.Result = Result;