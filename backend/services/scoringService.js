// services/scoringService.js
const { AnswerScore } = require('../models');

const getAllScores = async () => {
  return await AnswerScore.findAll();
};

const upsertScore = async (answerId, programId, points) => {
  const [score, created] = await AnswerScore.findOrCreate({
    where: { answer_id: answerId, program_id: programId },
    defaults: { points }
  });

  if (!created) await score.update({ points });

  return score;
};

const batchUpsertScores = async (scores) => {
  await AnswerScore.bulkCreate(
    scores.map((score) => ({
      answer_id: score.answer_id,
      program_id: score.program_id,
      points: score.points
    })),
    {
      updateOnDuplicate: ['points', 'updated_at']
    }
  );
  return { updated: scores.length };
};

module.exports = {
  getAllScores,
  upsertScore,
  batchUpsertScores
};
