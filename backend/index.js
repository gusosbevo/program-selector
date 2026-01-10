const express = require('express');
const app = express();
const cors = require('cors');

const usersRouter = require('./controllers/users');

const programsRouter = require('./controllers/programs');
const sectionsRouter = require('./controllers/sections');
const questionsRouter = require('./controllers/questions');
const scoringRouter = require('./controllers/scoring');
const surveysRouter = require('./controllers/surveys');

const { connectToDatabase } = require('./util/db');
const { PORT } = require('./util/config');

app.use(express.json());
app.use(cors());

app.use('/api/programs', programsRouter);
app.use('/api/sections', sectionsRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/scoring', scoringRouter);
app.use('/api/surveys', surveysRouter);

app.use('/api/users', usersRouter);

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database', err);
  });
