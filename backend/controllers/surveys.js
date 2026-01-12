// controllers/surveys.js
const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const surveyService = require('../services/surveyService');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const surveys = await surveyService.getAllSurveys();
    res.json(surveys);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const survey = await surveyService.getSurveyById(req.params.id);
    if (!survey) return res.status(404).json({ error: 'Survey not found' });
    res.json(survey);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const survey = await surveyService.createSurvey(req.body.user_name);

    for (const answer of req.body.answers) await surveyService.addResponse(survey.id, answer.question_id, answer.answer_id);

    const results = await surveyService.completeSurvey(survey.id);

    res.status(201).json({
      survey_id: survey.id,
      results: results.programs.map((p) => ({
        program_id: p.program_id,
        total_points: p.score,
        rank: p.rank,
        questions_answered: p.questions_answered,
        top_contributing_answers: p.top_contributing_answers
      })),
      calculated_at: results.calculated_at
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/responses', async (req, res, next) => {
  try {
    const response = await surveyService.addResponse(req.params.id, req.body.question_id, req.body.answer_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/complete', async (req, res, next) => {
  try {
    const results = await surveyService.completeSurvey(req.params.id);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
