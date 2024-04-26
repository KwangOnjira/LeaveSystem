const { sequelize, Sequelize } = require("../../Config");

module.exports = (sequelize, Sequelize) => {
    const ordinationleave = sequelize.define(
      "ordinationleave",
      {leaveID: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: "leaveID",
      },
      level: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: "level",
      },
        useTo: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          field: "useTo",
        },
        nameTemple:{
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "nameTemple",
        },
        addressTemple:{
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "addressTemple",
        },
        dateOrdi:{
          type: Sequelize.DATE,
          allowNull: true,
          field: "dateOrdi",
        },
        stayTemple:{
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "stayTemple",
        },
        addressStayTemple:{
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "addressStayTemple",
        },
      },
      {
        tableName: "ordinationleave",
        timestamps: false,
      }
    );
    return ordinationleave;
  };