module.exports = {
  dialect: "postgres",
  host: "localhost",
  username: "postgres",
  password: "docker",
  database: "security",
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
};
