const Question = require('./question');
const Answer = require('./answer');
const Program = require('./program');
const AnswerScore = require('./answerscore');
const Survey = require('./survey');
const Response = require('./response');
const QuestionSection = require('./questionsection');
const User = require('./user');

const { sequelize } = require('../util/db');

//sequelize.sync({ force: true });

QuestionSection.hasMany(Question, { foreignKey: 'question_section_id' });
Question.belongsTo(QuestionSection, { foreignKey: 'question_section_id' });

Question.hasMany(Answer, { foreignKey: 'question_id' });
Answer.belongsTo(Question, { foreignKey: 'question_id' });

Answer.belongsToMany(Program, { through: AnswerScore, as: 'programs' });
Program.belongsToMany(Answer, { through: AnswerScore, as: 'answers' });

Survey.hasMany(Response);
Response.belongsTo(Survey);

Response.belongsTo(Question);
Question.hasMany(Response);

Response.belongsTo(Answer);
Answer.hasMany(Response);

Question.belongsTo(Answer, { as: 'showIfAnswer', foreignKey: 'show_if_answer_id' });

// sequelize.sync()
//sequelize.sync({ force: true });
sequelize.sync({ alter: true });

module.exports = { User, Question, Answer, Program, AnswerScore, Survey, Response, QuestionSection };
