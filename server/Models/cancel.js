const { sequelize, Sequelize } = require("../Config");

module.exports = (sequelize, Sequelize) => {
  const cancel_leave = sequelize.define(
    "cancel_leave",
    {
      cancelID: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        field: "cancelID",
        
      },
      topic: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "topic",
      },
      to: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "to",
      },
      reason: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "reason",
      },
      date: { type: Sequelize.DATE, allowNull: false, field: "date" },
      cancelFirstDay: { type: Sequelize.DATE, allowNull: false, field: "cancelFirstDay" },
      cancelLastDay: { type: Sequelize.DATE, allowNull: false, field: "cancelLastDay" },
      cancelNumDay: { type: Sequelize.FLOAT, allowNull: false, field: "cancelNumDay" },
      status: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "status",
      },
      allow: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        field: "allow",
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: true,
        field: "comment",
      },
      typeCount: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "typeCount",
      },
      who_inspector: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: "who_inspector",
      },
      date_inspector: { type: Sequelize.DATE, allowNull: true, field: "date_inspector" },
      who_first_supeior: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: "who_first_supeior",
      },
      date_first_supeior: { type: Sequelize.DATE, allowNull: true, field: "date_first_supeior" },
      who_second_supeior: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: "who_second_supeior",
      },
      date_second_supeior: { type: Sequelize.DATE, allowNull: true, field: "date_second_supeior" },
    },
    {
      tableName: "cancel_leave",
    }
  );

  return cancel_leave;
};







