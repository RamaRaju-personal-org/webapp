// userModel.js
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const { initializeDatabase } = require('./mysql-db-connect');

const userModelPromise = initializeDatabase().then(sequelize => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(value, salt);
                this.setDataValue('password', hashedPassword);
            },
        },
    }, {
        timestamps: true, // Enable timestamp fields (createdAt, updatedAt)
    });

    // Sync the model with the database, creating the table if it doesn't exist
    sequelize.sync().then(() => console.log('User table has been successfully created, if one doesn\'t exist'));

    return User;
}).catch(error => {
    console.error('Error during User model initialization:', error);
    throw error; // Rethrow to handle it appropriately (e.g., halt the application if necessary)
});

module.exports = userModelPromise;
