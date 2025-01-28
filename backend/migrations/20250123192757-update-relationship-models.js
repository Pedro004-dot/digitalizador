'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Alterar a coluna prefeituraId para referência à tabela correta
    await queryInterface.addColumn('Usuarios', 'prefeituraId', {
      type: Sequelize.STRING,
      references: {
        model: 'Prefeituras', // Nome exato da tabela no banco
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Outros ajustes necessários...
  },

  async down(queryInterface, Sequelize) {
    // Remover as alterações se precisar reverter
    await queryInterface.removeColumn('Usuarios', 'prefeituraId');
  },
};