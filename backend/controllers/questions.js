// controllers/questions.js
const router = require('express').Router();
const { Question, Answer, QuestionSection } = require('../models');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const questions = await Question.findAll({
      include: [
        { model: Answer, as: 'answers', separate: true, order: [['order', 'ASC']] },
        { model: QuestionSection, as: 'question_section' }
      ],
      order: [
        ['question_section_id', 'ASC'],
        ['order', 'ASC']
      ]
    });
    res.json(questions);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const question = await Question.findByPk(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    await question.update(req.body);
    res.json(question);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const question = await Question.findByPk(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    await question.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.post('/:questionId/answers', authenticate, async (req, res, next) => {
  try {
    const answer = await Answer.create({
      ...req.body,
      question_id: req.params.questionId
    });
    res.status(201).json(answer);
  } catch (error) {
    next(error);
  }
});

router.put('/:questionId/answers/:answerId', authenticate, async (req, res, next) => {
  try {
    const answer = await Answer.findOne({
      where: { id: req.params.answerId, question_id: req.params.questionId }
    });
    if (!answer) return res.status(404).json({ error: 'Answer not found' });

    await answer.update(req.body);
    res.json(answer);
  } catch (error) {
    next(error);
  }
});

router.delete('/:questionId/answers/:answerId', authenticate, async (req, res, next) => {
  try {
    const answer = await Answer.findOne({
      where: { id: req.params.answerId, question_id: req.params.questionId }
    });
    if (!answer) return res.status(404).json({ error: 'Answer not found' });

    await answer.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
