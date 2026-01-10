require('dotenv').config();

const DB_CONFIG = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
};

const DATABASE_URL = `postgres://${DB_CONFIG.user}:${DB_CONFIG.password}@${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}`;

module.exports = { DATABASE_URL, DB_CONFIG, CA_CERT: process.env.CA_CERT, PORT: process.env.PORT || 3001 };
