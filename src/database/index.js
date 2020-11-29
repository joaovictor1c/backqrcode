import Sequelize from "sequelize";
import databaseConfig from "../config/database";
import User from "../app/models/User";
import QrCode from "../app/models/QrCode";


const models = [User, QrCode];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

}

export default new Database();
