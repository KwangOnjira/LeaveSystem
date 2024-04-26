module.exports = (sequelize, Sequelize) => {
    const statistic = sequelize.define(
      "statistic",
      {
        statisticID: {
          type: Sequelize.INTEGER(11),
          primaryKey: true,
          field: "statisticID",
        },
        fiscal_year: {
          type: Sequelize.FLOAT,
          allowNull: true,
          defaultValue: 0,
          field: "fiscal_year",
        },
        range: {
          type: Sequelize.FLOAT,
          allowNull: true,
          defaultValue: 0,
          field: "range",
        },
        isStatOfLeaveID: {
          type: Sequelize.INTEGER(11),
          allowNull: true,
          defaultValue: null,
          field: "isStatOfLeaveID",
        },
        isStatOfCancelID: {
          type: Sequelize.INTEGER(11),
          allowNull: true,
          defaultValue: null,
          field: "isStatOfCancelID",
        },
        leave_rights: {
          type: Sequelize.INTEGER(11),
          allowNull: true,
          field: "leave_rights",
        },
        VL_accumulatedDays: {
          type: Sequelize.INTEGER(11),
          allowNull: true,
          field: "VL_accumulatedDays",
        },
        VL_total: {
          type: Sequelize.INTEGER(11),
          allowNull: true,
          field: "VL_total",
        },
        VL_lastLeave: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "VL_lastLeave",
        },
        VL_thisLeave: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "VL_thisLeave",
        },
        currentUseVL: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "currentUseVL",
        },
        VL_remaining: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "VL_remaining",
        },
        leave_count: {
          type: Sequelize.INTEGER(11),
          allowNull: true,
          defaultValue: 0,
          field: "leave_count",
        },
        SL_lastLeave: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "SL_lastLeave",
        },
        SL_thisLeave: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "SL_thisLeave",
        },
        SL_remaining: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "SL_remaining",
        },
        SL_In_Range: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "SL_In_Range",
        },
        PL_lastLeave: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "PL_lastLeave",
        },
        PL_thisLeave: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "PL_thisLeave",
        },
        PL_remaining: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "PL_remaining",
        },
        PL_In_Range: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "PL_In_Range",
        },
        ML_lastleave: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "ML_lastleave",
        },
        ML_thisleave: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "ML_thisleave",
        },
        ML_DayCount: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "ML_DayCount",
        },
        ML_In_Range: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "ML_In_Range",
        },
        OL_DayCount: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "OL_DayCount",
        },
        OL_In_Range: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "OL_In_Range",
        },
        STL_DayCount: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "STL_DayCount",
        },
        STL_In_Range: {
          type: Sequelize.FLOAT,
          allowNull: true,
          field: "STL_In_Range",
        },
        total_leaveDay: {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0,
          field: "total_leaveDay",
        },
      },
      {
        tableName: "statistic",
      }
    );
  
    return statistic;
  };
  