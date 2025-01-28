// database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('digitalizador', 'postgres', '9bUu7yFrcAwtyMwM0khX', {
  host: 'digitalizador.ct8soqyced0t.sa-east-1.rds.amazonaws.com',
  dialect: 'postgres',
  logging: false, // Defina como true para ver os logs das queries no console
});

module.exports = sequelize;