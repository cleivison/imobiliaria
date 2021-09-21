'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Imovel',
      'destaque',
      {
        type: Sequelize.BOOLEAN
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Imovel',
      'destaque'
    )
  }
};
