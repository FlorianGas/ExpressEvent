module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn("evenement", "nb_place", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn("evenement", "nb_place");
  }
};
