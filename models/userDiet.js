const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const User = require('../models/users');
const DietPlan = require('../models/dietPlans');



const UserDiet = sequelize.define('UserDiet', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dietPlanId: {
    type: DataTypes.INTEGER,
  },
   date: {
    type: DataTypes.DATE,
  },
  permanentDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
  tableName: 'UserDiet',
  timestamps: true
});

UserDiet.belongsTo(User, { foreignKey: 'userId',as:"user_details" });
UserDiet.belongsTo(DietPlan, { foreignKey: 'dietPlanId',as:"dietPlan_details" });

module.exports = UserDiet;