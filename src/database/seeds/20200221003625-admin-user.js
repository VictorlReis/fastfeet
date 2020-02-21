const bycrypt = require('bcryptjs');

('use strict');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'FastFeet admin',
          email: 'admin@fastfeet.com',
          password_hash: bycrypt.hashSync('1234', 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', [
      {
        name: 'FastFeet admin',
      },
    ]);
  },
};
