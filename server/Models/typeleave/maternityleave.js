const { sequelize, Sequelize } = require("../../Config");

module.exports = (sequelize, Sequelize) => {
    const maternityleave = sequelize.define(
      "maternityleave",
      {leaveID: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: "leaveID",
      }},
      {
        tableName: "maternityleave",
        timestamps: false,
      }
    );
    return maternityleave;
  };