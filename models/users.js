const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = sequelize.define('User', {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  permanentDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  setNewPwd: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  forgotPasswordOtp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  forgotPasswordOtpExpire: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true
});

// Custom instance methods
User.prototype.createJWT = function () {
  return jwt.sign(
    { userId: this.id, email: this.email },
    process.env.JWT_SECRET,
    // { expiresIn: "3d" }
  );
};

User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.compareForgotPasswordOtp = async function (otp) {
  return await bcrypt.compare(otp, this.forgotPasswordOtp);
};

module.exports = User;
