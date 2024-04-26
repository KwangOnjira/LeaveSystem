const { sequelize, Sequelize } = require("../Config");

module.exports = (sequelize, Sequelize) => {
  const leave = sequelize.define(
    "leave",
    {
      leaveID: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        field: "leaveID",
        
      },
      fiscal_year: {
        type: Sequelize.FLOAT,
        allowNull: true,
        field: "fiscal_year",
        
      },
      range: {
        type: Sequelize.FLOAT,
        allowNull: true,
        field: "range",
        
      },
      topic: {
        type: Sequelize.STRING,
        allowNull: true,
        field: "topic",
      },
      type: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: "type",
      },
      to: {
        type: Sequelize.STRING(25),
        allowNull: true,
        field: "to",
      },
      date: { type: Sequelize.DATE, allowNull: true, field: "date" },
      contact: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: "contact",
      },
      firstDay: { type: Sequelize.DATE, allowNull: true, field: "firstDay" },
      lastDay: { type: Sequelize.DATE, allowNull: true, field: "lastDay" },
      numDay: { type: Sequelize.FLOAT, allowNull: true, field: "numDay" },
      status: {
        type: Sequelize.STRING(255),
        allowNull: true,
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
        allowNull: true,
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
      cancelOrNot: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: "cancelOrNot",
      },
    },
    {
      tableName: "leave",
    }
  );

  return leave;
};







