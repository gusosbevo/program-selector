const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class Response extends Model {}

Response.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'response'
  }
);

module.exports = Response;
