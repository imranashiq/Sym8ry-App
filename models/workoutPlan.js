const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const User = require('../models/users');
const Coaching = require('../models/coaching');



const WorkoutPlan = sequelize.define('WorkoutPlan', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coachId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  coachingId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  permanentDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
  tableName: 'workoutPlans',
  timestamps: true
});

WorkoutPlan.belongsTo(User, { foreignKey: 'coachId',as:"coach_details" });
WorkoutPlan.belongsTo(Coaching, { foreignKey: 'coachingId',as:"coaching_details" });

module.exports = WorkoutPlan;