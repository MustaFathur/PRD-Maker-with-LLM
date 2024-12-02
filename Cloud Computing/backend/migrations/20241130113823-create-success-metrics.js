'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Success_Metrics', {
      metric_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      prd_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PRDs',
          key: 'prd_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      metric_name: {
        type: Sequelize.STRING
      },
      definition: {
        type: Sequelize.TEXT
      },
      actual_value: {
        type: Sequelize.DECIMAL
      },
      target_value: {
        type: Sequelize.DECIMAL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Success_Metrics');
  }
};