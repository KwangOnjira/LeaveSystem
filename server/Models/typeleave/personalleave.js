const { sequelize, Sequelize } = require("../../Config");

module.exports = (sequelize, Sequelize) => {
    const personalleave = sequelize.define(
      "personalleave",
      {
        leaveID: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: "leaveID",
      },
        reason: {
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "reason",
        },
      },
      {
        tableName: "personalleave",
        timestamps: false,
      }
    );
    return personalleave;
  };