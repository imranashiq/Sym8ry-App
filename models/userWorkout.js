const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const Workout = require('../models/workout');
const User = require('../models/users');


const UserWorkout = sequelize.define('UserWorkout', {
    workoutId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
    trainerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
    time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  weightPerSet: {
  type: DataTypes.JSON,
  allowNull: false,
  defaultValue: [], // This will store an array of set objects
  validate: {
    isArrayOfSets(value) {
      if (!Array.isArray(value)) {
        throw new Error('weightPerSet must be an array');
      }
      // Optional: validate each set object in the array
      value.forEach(set => {
        if (typeof set !== 'object' || set === null) {
          throw new Error('Each set must be an object');
        }
        if (typeof set.weight !== 'number' || typeof set.reps !== 'number') {
          throw new Error('Each set must have weight and reps as numbers');
        }
      });
    }
  }
},
  permanentDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
  tableName: 'UserWorkout',
  timestamps: true
});

UserWorkout.belongsTo(Workout, { foreignKey: 'workoutId',as:"workout" });
UserWorkout.belongsTo(User, { foreignKey: 'trainerId',as:"trainer" });
UserWorkout.belongsTo(User, { foreignKey: 'userId',as:"user" });



module.exports = UserWorkout;