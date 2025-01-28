"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable("Usuarios");
    await queryInterface.dropTable("Prefeituras");
  },

  async down(queryInterface, Sequelize) {
    // Opcional: recriar as tabelas se necessário
    await queryInterface.createTable("Prefeituras", {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      cidade: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.createTable("Usuarios", {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      prefeituraId: {
        type: Sequelize.STRING,
        references: {
          model: "Prefeituras",
          key: "id",
        },
        allowNull: true,
      },
      permissoes: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
};