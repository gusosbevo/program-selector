// controllers/scoring.js
const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const scoringService = require('../services/scoringService');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const scores = await scoringService.getAllScores();
    res.json(scores);
  } catch (error) {
    next(error);
  }
});

router.put('/:answerId/:programId', authenticate, async (req, res, next) => {
  try {
    const score = await scoringService.upsertScore(req.params.answerId, req.params.programId, req.body.points);
    res.json(score);
  } catch (error) {
    next(error);
  }
});

router.post('/batch', authenticate, async (req, res, next) => {
  try {
    const result = await scoringService.batchUpsertScores(req.body.scores);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
