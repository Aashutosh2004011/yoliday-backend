'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Categories', [
      {
        id: uuidv4(),
        name: 'Web Development',
        description: 'Projects related to websites, frontend and backend development.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Mobile Development',
        description: 'Projects for Android and iOS platforms.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Data Science',
        description: 'Machine learning, data visualization, and analytics projects.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Game Development',
        description: 'Game design and development for PC, mobile, and consoles.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'UI/UX Design',
        description: 'User interface and experience design projects.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'DevOps',
        description: 'Infrastructure, CI/CD, and automation projects.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Cybersecurity',
        description: 'Security audits, penetration testing, and secure system design.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'E-Commerce',
        description: 'Online shopping, marketplace, and digital sales platforms.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Cloud Computing',
        description: 'Projects involving AWS, Azure, Google Cloud and cloud-native apps.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Blockchain',
        description: 'Decentralized applications, NFTs, smart contracts, and more.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
