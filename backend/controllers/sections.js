// controllers/sections.js
const router = require('express').Router();
const { QuestionSection } = require('../models');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const sections = await QuestionSection.findAll({ order: [['order', 'ASC']] });
    res.json(sections);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const section = await QuestionSection.create(req.body);
    res.status(201).json(section);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const section = await QuestionSection.findByPk(req.params.id);
    if (!section) return res.status(404).json({ error: 'Section not found' });

    await section.update(req.body);
    res.json(section);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const section = await QuestionSection.findByPk(req.params.id);
    if (!section) return res.status(404).json({ error: 'Section not found' });

    await section.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
