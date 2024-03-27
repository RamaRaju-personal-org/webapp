const { DataTypes } = require('sequelize');
const { initializeDatabase } = require('./mysql-db-connect');

// A variable to store the Sequelize instance once it is initialized.
let sequelizeInstance;

// A self-invoking async function to initialize the EmailVerification model.
const emailVerificationModelPromise = (async () => {
  // If the Sequelize instance is not already initialized, do so.
  if (!sequelizeInstance) {
    sequelizeInstance = await initializeDatabase();
  }

  // Throw an error if initialization failed to get the Sequelize instance.
  if (!sequelizeInstance) {
    throw new Error('Sequelize instance is not initialized');
  }

  // Define the EmailVerification model.
  const EmailVerification = sequelizeInstance.define('EmailVerification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users', // This should match the name of your User model as Sequelize would define it.
        key: 'id',
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: true
  });

  // Synchronize the model with the database.
  await sequelizeInstance.sync();

  // Return the model once it's ready.
  return EmailVerification;
})();

module.exports = emailVerificationModelPromise;
