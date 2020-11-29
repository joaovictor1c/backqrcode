module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("qrcodes", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_id:{
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",

      },
      secret:{
        type: Sequelize.STRING,
        allowNull: false
      },
      qrcode: {
        type: Sequelize.STRING(10000),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable("qrcodes");
  }
};
