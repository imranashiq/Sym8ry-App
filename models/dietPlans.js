const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const User = require('../models/users');
const Coaching = require('../models/coaching');



const DietPlans = sequelize.define('DietPlans', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  trainerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  coachingId: {
    type: DataTypes.INTEGER,
  },
  permanentDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
  tableName: 'DietPlans',
  timestamps: true
});

DietPlans.belongsTo(User, { foreignKey: 'trainerId',as:"trainer_details" });
DietPlans.belongsTo(Coaching, { foreignKey: 'coachingId',as:"coaching_details" });

module.exports = DietPlans;