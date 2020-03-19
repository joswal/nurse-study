const { ensureAuthenticated, ensurePostAuthenticated, forwardAuthenticated } = require("../middlewares/auth");
const { Article } = require("../models/articles");
const { Result } = require("../models/results");
const { Topic } = require("../models/topics");
const { Quiz } = require("../models/quizzes");
const { User } = require("../models/users");
const express = require('express');
const router = express.Router();

router.get('/topics', async (req, res) => {
    const topic = await Topic.find();
    res.send({
        code: 200,
        data: topic
    });
});

router.post("/topic", ensurePostAuthenticated, async (req, res) => {
    try {
        let { title } = req.body;
        if (!title) return res.send({
            code: 400,
            message: "please enter topic title",
            data: {}
        });

        let topic = await Topic.findOne({ title });
        if (topic) return res.send({
            code: 400,
            message: "topic already existing, please create new",
            data: {}
        });

        const { user_id } = await User.findById(req.user._id);
        topic = new Topic({
            user_id,
            title,
        });

        let new_topic = await topic.save();

        res.send({
            code: 200,
            message: "Successfully created topic",
            data: { new_topic }
        });

    } catch (error) {
        res.send({
            code: 400,
            message: "An error occurred"
        });
    }
});

router.post("/article", ensurePostAuthenticated, async (req, res) => {
    try {
        let { title, topic, category } = req.body;
        if (!title || !topic || !category) return res.send({
            code: 400,
            message: "please enter all details",
            data: {}
        });

        let article = await Article.findOne({ title });
        if (article) return res.send({
            code: 400,
            message: "article already existing, please create new",
            data: {}
        });

        const { user_id } = await User.findById(req.user._id);
        article = new Article({
            user_id,
            title,
            topic,
            category
        });

        let new_article = await article.save();

        res.send({
            code: 200,
            message: "Successfully created article",
            data: { new_article }
        });

    } catch (error) {
        res.send({
            code: 400,
            message: "An error occurred"
        });
    }
});

router.post("/quiz", ensurePostAuthenticated, async (req, res) => {
    try {
        let { title, topic, options } = req.body;
        if (!title || !topic || !options) return res.send({
            code: 400,
            message: "please enter all details",
            data: {}
        });

        let quiz = await Quiz.findOne({ title });
        if (quiz) return res.send({
            code: 400,
            message: "quiz already existing, please create new",
            data: {}
        });

        const { user_id } = await User.findById(req.user._id);
        quiz = new Quiz({
            user_id,
            title,
            topic,
            options
        });

        let new_quiz = await quiz.save();

        res.send({
            code: 200,
            message: "Successfully created quiz",
            data: { new_quiz }
        });

    } catch (error) {
        res.send({
            code: 400,
            message: "An error occurred"
        });
    }
});

router.post("/result", ensurePostAuthenticated, async (req, res) => {
    try {
        let { quiz, topic, score } = req.body;
        if (!title || !topic || !options) return res.send({
            code: 400,
            message: "please enter all details",
            data: {}
        });

        const { user_id } = await User.findById(req.user._id);
        const quizTitle = await Quiz.findOne({title: quiz});
        if (!quizTitle) return res.send({
            code: 400,
            message: "invalid quiz title, please enter correct quiz",
            data: {}
        });

        let result = new Result({
            user_id,
            quiz: quizTitle,
            score,
        });

        let new_result = await result.save();

        res.send({
            code: 200,
            message: "Successfully submitted result",
            data: { new_result }
        });

    } catch (error) {
        res.send({
            code: 400,
            message: "An error occurred"
        });
    }
});





module.exports = router;