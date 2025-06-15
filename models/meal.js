const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const DietPlan = require('../models/dietPlans');



const Meal = sequelize.define('Meal', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
   kcal: {
    type: DataTypes.STRING,
    allowNull: false
  },
  items: {
    type: DataTypes.JSON, 
    defaultValue: []
  },
  dietPlanId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  permanentDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
  tableName: 'Meal',
  timestamps: true
});

Meal.belongsTo(DietPlan, { foreignKey: 'dietPlanId',as:"dietPlan_details" });

module.exports = Meal;