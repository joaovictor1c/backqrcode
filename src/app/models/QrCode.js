import Sequelize, { Model } from "sequelize";

class QrCode extends Model {
  static init(sequelize) {
    super.init(
      {
        qrcode: Sequelize.STRING,
        secret: Sequelize.STRING
      },
      {
        sequelize,
        tableName:"qrcodes",
        freezeTableName: true
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  }
}

export default QrCode;
