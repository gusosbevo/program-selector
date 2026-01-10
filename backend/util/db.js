const pg = require('pg');
const Sequelize = require('sequelize');
const { DATABASE_URL, DB_CONFIG, CA_CERT } = require('./config');

// Parse DECIMAL fields as floats
Sequelize.postgres.DECIMAL.parse = function (value) {
  return parseFloat(value);
};

// For Sequelize connection
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca: CA_CERT
    }
  }
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database');
  } catch (err) {
    console.error('Failed to connect to the database', err);
    return process.exit(1);
  }

  return null;
};

module.exports = { connectToDatabase, sequelize };
