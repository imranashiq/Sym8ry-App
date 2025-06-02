const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const WorkoutPlan = require('../models/workoutPlan');

const Workout = sequelize.define('Workout', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
    muscle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   sets: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  reps: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
   weight: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  workoutPlanId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
   rest: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   video: {
    type: DataTypes.STRING,
  },
  permanentDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
  tableName: 'workout',
  timestamps: true
});

Workout.belongsTo(WorkoutPlan, { foreignKey: 'workoutPlanId',as:"workout_plan" });

module.exports = Workout;