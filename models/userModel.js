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
            validate: {
                is: {
                    args: [/^[^@]+@(example\.com|gmail\.com|outlook\.com|.+\.edu)$/i],
                    msg: "Username must be a valid email ending with @example.com, @gmail.com, @outlook.com, or any .edu domain"
                }
            },
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
        timestamps: true, 
    });

    sequelize.sync().then(() => console.log('User table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.error('Error creating table:', error));

    return User;
}).catch(error => {
    console.error('Error during User model initialization:', error);
    throw error; 
});

module.exports = userModelPromise;
