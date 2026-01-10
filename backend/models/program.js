const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class Program extends Model {}

Program.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'program'
  }
);

module.exports = Program;
