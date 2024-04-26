const { sequelize, Sequelize } = require("../Config");
const dbSeq = require('../Config/index');

module.exports = (sequelize, Sequelize) => {
    const holiday = sequelize.define(
      "holiday",
      {id: {
        type: Sequelize.INTEGER(20),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: "id",
      },
        name: {
          type: Sequelize.STRING(255),
          allowNull: false,
          field: "name",
        },
        date: {
          type: Sequelize.DATE,
          allowNull: false,
          field: "date",
        },
      },
      {
        tableName: "holiday",
        timestamps: false
      }
    );
    return holiday;
  };