// user.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ""
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false
  },
  login_type: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
    defaultValue: "NORMAL"
  },
});

module.exports = User;