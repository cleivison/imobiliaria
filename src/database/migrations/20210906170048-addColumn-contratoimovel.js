'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Contratoimovel',
      'finalizado',
      {
        type: Sequelize.BOOLEAN
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Contratoimovel',
      'finalizado'
    )
  }
};
