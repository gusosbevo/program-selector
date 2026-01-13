// services/surveyService.js
const { Survey, Response, Answer, AnswerScore, Program, Question } = require('../models');

const calculateResults = async (surveyId) => {
  const survey = await Survey.findByPk(surveyId, {
    include: [
      {
        model: Response,
        as: 'responses',
        include: [{ model: Answer }, { model: Question }]
      }
    ]
  });

  if (!survey) throw new Error('Survey not found');

  const programScores = {};
  const programQuestionCounts = {};
  const programAnswerContributions = {};
  const programCategoryBreakdown = {};

  for (const response of survey.responses) {
    const scores = await AnswerScore.findAll({
      where: { answer_id: response.answer_id }
    });

    for (const score of scores) {
      if (!programScores[score.programId]) {
        programScores[score.programId] = 0;
        programQuestionCounts[score.programId] = 0;
        programAnswerContributions[score.programId] = [];
        programCategoryBreakdown[score.programId] = {};
      }

      const points = parseFloat(score.points);
      programScores[score.programId] += points;
      programQuestionCounts[score.programId]++;

      const category = response.question.category || 'Övrigt';
      programCategoryBreakdown[score.programId][category] = (programCategoryBreakdown[score.programId][category] || 0) + points;

      if (Math.abs(points) >= 5) {
        programAnswerContributions[score.programId].push({
          question_id: response.question.id,
          question_text: response.question.text,
          answer_id: response.answer.id,
          answer_text: response.answer.text,
          points,
          category
        });
      }
    }
  }

  const programs = await Program.findAll();

  const results = programs
    .map((program) => {
      const totalPoints = programScores[program.id] || 0;
      const questionCount = programQuestionCounts[program.id] || 0;
      const avgScore = questionCount > 0 ? totalPoints / questionCount : 0;

      return {
        program_id: program.id,
        program_name: program.name,
        score: Math.round(avgScore * 10) / 10,
        questions_answered: questionCount,
        category_breakdown: programCategoryBreakdown[program.id] || {},
        top_contributing_answers: (programAnswerContributions[program.id] || []).sort((a, b) => Math.abs(b.points) - Math.abs(a.points)).slice(0, 3)
      };
    })
    .filter((p) => p.questions_answered > 0)
    .sort((a, b) => b.score - a.score)
    .map((p, index) => ({ ...p, rank: index + 1 }));

  const calculatedResults = {
    programs: results,
    calculated_at: new Date().toISOString()
  };

  await survey.update({
    completed: true,
    completed_at: new Date(),
    results: calculatedResults
  });

  return calculatedResults;
};

const getAllSurveys = async () => {
  return await Survey.findAll({
    order: [['createdAt', 'DESC']]
  });
};

const getSurveyById = async (id) => {
  return await Survey.findByPk(id, {
    include: [
      {
        model: Response,
        as: 'responses',
        include: [{ model: Question }, { model: Answer }]
      }
    ]
  });
};

const createSurvey = async (studentName) => {
  return await Survey.create({ student_name: studentName });
};

const addResponse = async (surveyId, questionId, answerId) => {
  const existing = await Response.findOne({
    where: { survey_id: surveyId, question_id: questionId }
  });

  if (existing) {
    await existing.update({ answer_id: answerId });
    return existing;
  }

  return await Response.create({
    survey_id: surveyId,
    question_id: questionId,
    answer_id: answerId
  });
};

const completeSurvey = async (surveyId) => {
  const results = await calculateResults(surveyId);
  return results;
};

module.exports = {
  calculateResults,
  getAllSurveys,
  getSurveyById,
  createSurvey,
  addResponse,
  completeSurvey
};
