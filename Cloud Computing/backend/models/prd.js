'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PRD extends Model {
    static associate(models) {
      PRD.belongsTo(models.User, { foreignKey: 'user_id' });
      PRD.belongsToMany(models.Personil, {
        through: models.PRD_Personil,
        foreignKey: 'prd_id',
        otherKey: 'personil_id',
        as: 'personils'
      });
      PRD.hasMany(models.DARCI, { foreignKey: 'prd_id', as: 'darciRoles' });
      PRD.hasMany(models.Timeline, { foreignKey: 'prd_id', as: 'timelines' });
      PRD.hasMany(models.Success_Metrics, { foreignKey: 'prd_id', as: 'successMetrics' });
      PRD.hasMany(models.User_Stories, { foreignKey: 'prd_id', as: 'userStories' });
      PRD.hasMany(models.UI_UX, { foreignKey: 'prd_id', as: 'uiUx' });
      PRD.hasMany(models.References, { foreignKey: 'prd_id', as: 'references' });
      PRD.hasMany(models.PRD_Personil, { foreignKey: 'prd_id', as: 'prdPersonils' }); // Ensure this association is defined
    }
  }

  PRD.init({
    prd_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    document_version: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    document_stage: {
      type: DataTypes.ENUM('draft', 'completed')
    },
    created_date: {
      type: DataTypes.DATE
    },
    overview: {
      type: DataTypes.TEXT
    },
    source: {
      type: DataTypes.ENUM('gemini', 'openai')
    },
  }, {
    sequelize,
    modelName: 'PRD',
    tableName: 'PRDs',
    timestamps: true
  });

  return PRD;
};