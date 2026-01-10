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
  await Promise.all(scores.map(({ answer_id, program_id, points }) => upsertScore(answer_id, program_id, points)));

  return { success: true };
};

module.exports = {
  getAllScores,
  upsertScore,
  batchUpsertScores
};
