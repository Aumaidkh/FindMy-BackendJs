const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OtpModel = sequelize.define("OtpModel",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        autoIncrement: false,
        unique: true
    },
    otp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: false
    },
    expires_at: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: new Date().getTime() + (10 * 60 * 1000)
    } 
});


module.exports = OtpModel;