'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminRoleId = uuidv4();
    const userRoleId = uuidv4();
    
    return queryInterface.bulkInsert('Roles', [
      {
        id: adminRoleId,
        name: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: userRoleId,
        name: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', null, {});
  }
};