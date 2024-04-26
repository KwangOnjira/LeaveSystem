const { sequelize, Sequelize } = require("../../Config");


module.exports = (sequelize, Sequelize) => {
    const vacationleave = sequelize.define(
      "vacationleave",
      {leaveID: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: "leaveID",
      },
        deputyName: {
          type: Sequelize.STRING(255),
          allowNull: false,
          field: "deputyName",
        },
        date_deputy_confirm: {
          type: Sequelize.DATE,
          allowNull: true,
          field: "date_deputy_confirm",
        },
      },
      {
        tableName: "vacationleave",
        timestamps: false
      }
    );
    return vacationleave;
  };