// database.js
const { Sequelize } = require('sequelize');

const sequelizeData = new Sequelize('digitalizador', 'postgres', '9bUu7yFrcAwtyMwM0khX', {
  host: 'digitalizador.ct8soqyced0t.sa-east-1.rds.amazonaws.com',
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Use apenas se for necessário evitar erros SSL
    },
  },
});

export default sequelizeData;