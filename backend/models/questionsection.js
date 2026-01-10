const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class QuestionSection extends Model {}

QuestionSection.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'question_section'
  }
);

module.exports = QuestionSection;
