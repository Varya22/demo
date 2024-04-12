const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    surname: { type: DataTypes.STRING },
    patronymic: { type: DataTypes.STRING },
    login: { type: DataTypes.STRING, unique: true, },
    email: { type: DataTypes.STRING, unique: true, },
    password: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
})

const ViolationReport = sequelize.define('violationReport', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    description: { type: DataTypes.TEXT },
    carNumber: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('new', 'confirmed', 'rejected'), defaultValue: 'new' }
});

User.hasMany(ViolationReport);
ViolationReport.belongsTo(User);


module.exports = {
    User,
    ViolationReport
}