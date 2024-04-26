const { sequelize, Sequelize } = require("../../Config");

module.exports = (sequelize, Sequelize) => {
    const sickleave = sequelize.define(
      "sickleave",
      {
        leaveID: {
          type: Sequelize.INTEGER(11),
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
          field: "leaveID",
        },
        files:{
          type: Sequelize.STRING,
          allowNull: true,
          field: "files"
        },
        reason: {
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "reason",
        },
      },
      {
        tableName: "sickleave",
        timestamps: false,
      }
    );
    return sickleave;
  };