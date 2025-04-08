'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roleIds = await queryInterface.sequelize.query(
      'SELECT id FROM `Roles`;'
    );
    
    const adminRoleId = roleIds[0][0]?.id || uuidv4();

    return queryInterface.bulkInsert('Users', [
      {
        id: uuidv4(),
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('securePassword123', 10),
        role: adminRoleId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Test User',
        email: 'user@example.com',
        password: await bcrypt.hash('userPassword123', 10),
        role: adminRoleId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};