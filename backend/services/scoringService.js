// services/scoringService.js
const { AnswerScore } = require('../models');
const { sequelize } = require('../util/db');

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
  const placeholders = scores.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3}, NOW(), NOW())`).join(',');
  const values = scores.flatMap((s) => [s.answer_id, s.program_id, s.points]);

  const [results] = await sequelize.query(
    `
    INSERT INTO answer_scores (answer_id, program_id, points, created_at, updated_at)
    VALUES ${placeholders}
    ON CONFLICT (answer_id, program_id) 
    DO UPDATE SET points = EXCLUDED.points, updated_at = NOW()
    RETURNING *
  `,
    {
      bind: values
    }
  );

  return results;
};

module.exports = {
  getAllScores,
  upsertScore,
  batchUpsertScores
};
