'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Usuarios', {
      fields: ['prefeituraId'],
      type: 'foreign key',
      name: 'usuarios_prefeituraId_fkey',
      references: {
        table: 'Prefeituras',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Usuarios', 'usuarios_prefeituraId_fkey');
  },
};