const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class Question extends Model {}

Question.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    show_if_answer_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'question'
  }
);

module.exports = Question;
