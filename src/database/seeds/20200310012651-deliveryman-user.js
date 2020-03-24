const bycrypt = require('bcryptjs');

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'FastFeet deliveryman',
          email: 'deliveryman@fastfeet.com',
          password_hash: bycrypt.hashSync('1234', 8),
          administrator: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('users', [
      {
        name: 'FastFeet deliveryman',
      },
    ]);
  },
};
