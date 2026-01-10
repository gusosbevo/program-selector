const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class Survey extends Model {}

Survey.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    student_name: {
      type: DataTypes.STRING
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    completed_at: {
      type: DataTypes.DATE
    },
    results: {
      type: DataTypes.JSON,
      defaultValue: null
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'survey'
  }
);

module.exports = Survey;
