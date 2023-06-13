const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const tokenModel = sequelize.define("TokenModel",{
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
    auth_token: {
        type: DataTypes.STRING,
        allowNull: true    
    },
    password_reset_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    expires_at: {
        type: DataTypes.BIGINT,
        allowNull: true
    }
});

module.exports = tokenModel;