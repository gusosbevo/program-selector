const router = require('express').Router();
const { Program } = require('../models');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const programs = await Program.findAll({ order: [['name', 'ASC']] });
    res.json(programs);
  } catch (error) {
    next(error);
  }
});

router.put('/', authenticate, async (req, res, next) => {
  try {
    const { id, ...data } = req.body;
    if (id) data.id = id;
    const [program, created] = await Program.upsert(data);
    res.status(created ? 201 : 200).json(program);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) return res.status(404).json({ error: 'Program not found' });
    await program.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
