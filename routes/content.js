const { ensureAuthenticated, ensurePostAuthenticated, ensurePostAuthorized } = require("../middlewares/auth");
const { Question } = require("../models/questions");
const { Article } = require("../models/articles");
const { Section } = require("../models/sections");
const { Result } = require("../models/results");
const { Topic } = require("../models/topics");
const { Quiz } = require("../models/quizzes");
const { Media } = require("../models/media");
const { User } = require("../models/users");

const express = require('express');
const router = express.Router();

router.get('/topics', ensureAuthenticated, async (req, res) => {
    const topics = await Topic.find();
    res.send({
        code: 200,
        data: topics
    });
});

router.get('/sections', ensureAuthenticated, async (req, res) => {
    const sections = await Section.find();
    res.send({
        code: 200,
        data: sections
    });
});

router.get('/section_articles/:id', ensureAuthenticated, async (req, res) => {
    const articles = await Article.find({ section_id: req.params.id });

    if (!articles) return res.send({
        code: 400,
        message: "invalid section, please put a valid section id to get articles"
    });

    res.send({
        code: 200,
        data: articles
    });
});

router.get('/section_media/:id', ensureAuthenticated, async (req, res) => {
    const media = await Media.find({ section_id: req.params.id });

    if (!media) return res.send({
        code: 400,
        message: "invalid section, please put a valid section id to get media"
    });

    res.send({
        code: 200,
        data: media
    });
});

router.get('/section_quizzes/:id', ensureAuthenticated, async (req, res) => {
    const quizzes = await Quiz.find({ section_id: req.params.id });

    if (!quizzes) return res.send({
        code: 400,
        message: "invalid section, please put a valid section id to get quizzes"
    });

    quizzes.map((quiz) => {
        return quiz.questions = Question.find({quiz_id: quiz._id})
    })

    res.send({
        code: 200,
        data: quizzes
    });
});

router.post("/topic", ensurePostAuthorized, async (req, res) => {
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
            created_by: user_id,
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

router.post("/section", ensurePostAuthorized, async (req, res) => {
    try {
        let { title } = req.body;
        if (!title) return res.send({
            code: 400,
            message: "please enter section title",
            data: {}
        });

        let section = await Section.findOne({ title });
        if (section) return res.send({
            code: 400,
            message: "section already existing, please create new",
            data: {}
        });

        const { user_id } = await User.findById(req.user._id);
        section = new Section({
            created_by: user_id,
            title,
        });

        let new_section = await section.save();

        res.send({
            code: 200,
            message: "Successfully created section",
            data: { new_section }
        });

    } catch (error) {
        res.send({
            code: 400,
            message: "An error occurred"
        });
    }
});

router.post("/article", ensurePostAuthorized, async (req, res) => {
    try {
        let { title, section_id, category, content } = req.body;
        if (!title || !section_id || !category || !content) return res.send({
            code: 400,
            message: "please enter all details",
            data: {}
        });

        let article = await Article.findOne({ $or: [{ title }, { content }] });
        if (article) return res.send({
            code: 400,
            message: "article already existing, please create new",
            data: {}
        });

        const { user_id } = await User.findById(req.user._id);

        const section = await Section.findById(section_id);
        if (!section) return res.send({
            code: 400,
            message: "invalid section , please pick correct section",
            data: {}
        });

        article = new Article({
            created_by: user_id,
            title,
            section_id,
            category,
            content
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
            message: "An error occurred,couldnt create article"
        });
    }
});

router.post("/media", ensurePostAuthorized, async (req, res) => {
    try {
        let { title, section_id, type, link } = req.body;

        if (!title || !section_id || !type || !link) return res.send({
            code: 400,
            message: "please enter all details",
            data: {}
        });

        let media = await Media.findOne({ $or: [{ title }, { link }] });

        if (media) return res.send({
            code: 400,
            message: "media already existing, please create new",
            data: {}
        });

        const { user_id } = await User.findById(req.user._id);

        const section = await Section.findById(section_id);

        if (!section) return res.send({
            code: 400,
            message: "invalid section , please pick correct section",
            data: {}
        });

        media = new Media({
            added_by: user_id,
            title,
            section_id,
            type,
            link
        });

        let new_media = await media.save();

        res.send({
            code: 200,
            message: "Successfully created media",
            data: { new_media }
        });

    } catch (error) {
        res.send({
            code: 400,
            message: "An error occurred, couldnt create media"
        });
    }
});

router.post("/quiz", ensurePostAuthorized, async (req, res) => {
    try {
        let { title, section_id } = req.body;
        if (!title || !section_id) return res.send({
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

        const section = await Section.findOne({ _id: section_id });
        if (!section) return res.send({
            code: 400,
            message: "invalid section , please pick correct section",
            data: {}
        });

        quiz = new Quiz({
            created_by: user_id,
            title,
            section_id
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

router.post("/question", ensurePostAuthorized, async (req, res) => {
    try {
        let { title, quiz_id, options, correct_option, question } = req.body;
        if (!title || !quiz_id || !options || !correct_option || !question) return res.send({
            code: 400,
            message: "please enter all details",
            data: {}
        });

        let newQuestion = await Question.findOne({ question });
        if (newQuestion) return res.send({
            code: 400,
            message: "question already existing, please create new",
            data: {}
        });

        const { user_id } = await User.findById(req.user._id);

        const quiz = await Quiz.findOne({ _id: quiz_id });
        if (!quiz) return res.send({
            code: 400,
            message: "invalid quiz , please pick correct quiz",
            data: {}
        });

        newQuestion = await Question.findOne({ $and: [{ title }, { quiz_id }] });
        if (newQuestion) return res.send({
            code: 400,
            message: `${title} already exist for this quiz, please create new or give new title`,
            data: {}
        });

        if (!options.hasOwnProperty(correct_option)) return res.send({
            code: 400,
            message: `invalid correct option , please make sure ${correct_option} exists in the options object`,
            data: {}
        });

        newQuestion = new Question({
            created_by: user_id,
            title,
            quiz_id,
            options,
            correct_option,
            question
        });

        let new_Question = await newQuestion.save();

        res.send({
            code: 200,
            message: "Successfully created new question",
            data: { new_Question }
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
        let { quiz_id, score } = req.body;
        if (!quiz_id || !score) return res.send({
            code: 400,
            message: "please enter all details",
            data: {}
        });

        const { user_id } = await User.findById(req.user._id);
        const quiz = await Quiz.findById(quiz_id);
        if (!quiz) return res.send({
            code: 400,
            message: "invalid quiz , please pick correct quiz",
            data: {}
        });

        let freshscore = { score, Added_on: new Date().toLocaleDateString() + "  " + new Date().toLocaleTimeString()  }
        let result = await Result.findOne({ $and: [{ user_id }, { quiz_id }] });
        if (result) {
            let scores = result.scores;
            scores.push(freshscore);
        } else {
            result = new Result({
                user_id,
                quiz_id,
                scores: [freshscore]
            });
        }

        let new_result = await result.save();

        res.send({
            code: 200,
            message: "Successfully submitted result score",
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