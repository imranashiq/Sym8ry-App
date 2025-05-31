const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');


const Coaching = sequelize.define('Coaching', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  workoutPlan: {
    type: DataTypes.STRING,
  },
   dietPlan: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.FLOAT,
  },
    coachId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subscriberIds: {
    type: DataTypes.JSON, 
    defaultValue: []
  },
   duration: {
    type: DataTypes.STRING,
  },
  permanentDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
  tableName: 'coachings',
  timestamps: true
});


module.exports = Coaching;
