//user model
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define( "user", {
        userName: {
            type: DataTypes.STRING, //must be string
            allowNull: false //cannot be empty
        },
        email: {
            type: DataTypes.STRING, //must be string
            unique: true, //has to be a unique email that isnt inside database
            isEmail: true, //checks for email format
            allowNull: false //cannot be empty
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {timestamps: true}, )
    return User
 }