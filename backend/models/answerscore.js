const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class AnswerScore extends Model {}

AnswerScore.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    points: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'answer_score'
  }
);

module.exports = AnswerScore;
