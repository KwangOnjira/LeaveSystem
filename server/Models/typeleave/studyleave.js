const { sequelize, Sequelize } = require("../../Config");

module.exports = (sequelize, Sequelize) => {
    const studyleave = sequelize.define(
      "studyleave",
      {leaveID: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: "leaveID",
      },
        level: {
          type: Sequelize.STRING(255),
          allowNull: false,
          field: "level",
        },
        salaryNumber:{
          type: Sequelize.STRING(255),
          allowNull: false,
          field: "salaryNumber",
        },
        salaryAlphabet:{
          type: Sequelize.STRING(255),
          allowNull: false,
          field: "salaryAlphabet",
        },
        typeStudy:{
          type: Sequelize.STRING(255),
          allowNull: false,
          field: "typeStudy",
        },
        subject:{
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "subject",
        },
        degree:{
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "degree",
        },
        academy:{
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "academy",
        },
        countrystudy:{
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "countrystudy",
        },
        scholarshipstudy:{
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "scholarshipstudy",
        },
        course:{
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "course",
        },
        address:{
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "address",
        },
        countrytrain:{
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "countrytrain",
        },
        scholartrain:{
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "scholartrain",
        },
      },
      {
        tableName: "studyleave",
        timestamps: false
      }
    );
    return studyleave;
  };
  