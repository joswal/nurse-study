const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    created_by: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    quiz_id: {
        type: String,
        required: true
    },
    options: {
        type: Object,
        default: {},
        required: true,
    },
    correctoption:{
        type: String,
        required: true
    },
    question:{
        type: String,
        required: true
    },
    created_on: {
        type: Date,
        default: Date.now,
    }
});

const Question = mongoose.model('Question', questionSchema);

exports.Question = Question;