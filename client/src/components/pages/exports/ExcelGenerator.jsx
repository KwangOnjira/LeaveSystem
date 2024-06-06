import React from "react";
import ExcelJS from "exceljs";
import axios from "axios";

const ExcelGenerator = async ({
  userData,
  range,
  type,
  inspector,
  inspectorSignature,
  title,
}) => {
  console.log("userData", userData);
  // console.log("userData[0]", userData[0].statistics[0].fiscal_year);
  console.log("range", range);
  console.log("type", type);
  console.log("inspector", inspector);
  console.log("inspectorSignature", inspectorSignature);
  console.log("title", title);

  const arabicToThaiNumerals = (number) => {
    if (!number) {
      return "๐";
    } else {
      const thaiNumerals = ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"];
      return number
        ?.toString()
        .replace(/\d/g, (match) => thaiNumerals[parseInt(match)]);
    }
  };

  let rangeAlphabet;
  if (range === 1) {
    rangeAlphabet = `วันที่ ๑ ตุลาคม ${arabicToThaiNumerals(
      userData[0].statistics[0].fiscal_year
    )} - วันที่ ๓๑ มีนาคม ${arabicToThaiNumerals(
      userData[0].statistics[0].fiscal_year + 1
    )}`;
  } else if (range === 2) {
    rangeAlphabet = `วันที่ ๑ เมษายน ${arabicToThaiNumerals(
      userData[0].statistics[0]?.fiscal_year + 1
    )} - วันที่ ๓๐ กันยายน ${arabicToThaiNumerals(
      userData[0].statistics[0]?.fiscal_year + 1
    )}`;
  }

  let workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("My Sheet", {
    pageSetup: { horizontalCentered: true, verticalCentered: true },
  });
  // sheet.properties.defaultRowHeight = 80;
  sheet.mergeCells("A1:K1");
  sheet.mergeCells("A2:A3");
  sheet.mergeCells("B2:B3");
  sheet.mergeCells("C2:C3");
  sheet.mergeCells("D2:K2");
  sheet.getRow(1).height = 220;
  sheet.getCell(
    "A1"
  ).value = `บัญชีแสดงวันลาของ${type}ขององค์การบริหารส่วนจังหวัดลำปาง\n ระหว่าง${rangeAlphabet}\n ${title}`;
  sheet.getRow(1).font = { size: 14 };
  sheet.getCell("A1").alignment = { wrapText: true };
  sheet.getCell("A1").alignment = { vertical: "middle", horizontal: "center" };

  sheet.getCell("A1").width = 220;

  sheet.getCell("A2").value = "ลำดับ";
  sheet.getCell("A2").alignment = { vertical: "middle", horizontal: "center" };
  sheet.getCell("A2").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell("B2").value = "ชื่อ - ตำแหน่ง";
  sheet.getCell("B2").alignment = { vertical: "middle", horizontal: "center" };
  sheet.getCell("B2").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell("C2").value = "จำนวนครั้งที่ลา(ครั้ง)";
  sheet.getCell("C2").alignment = { vertical: "middle", horizontal: "center" };
  sheet.getCell("C2").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell("D2").value = "จำนวนวันลา";
  sheet.getCell("D2").alignment = { vertical: "middle", horizontal: "center" };
  sheet.getCell("D2").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getRow(2).font = { size: 14 };
  sheet.getCell("D3").value = "ลาป่วย(วัน)";
  sheet.getCell("D3").alignment = { vertical: "middle", horizontal: "center" };
  sheet.getCell("D3").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell("E3").value = "ลากิจ(วัน)";
  sheet.getCell("E3").alignment = { vertical: "middle", horizontal: "center" };
  sheet.getCell("E3").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell("F3").value = "ลาอุปสมบท(วัน)";
  sheet.getCell("F3").alignment = { vertical: "middle", horizontal: "center" };
  sheet.getCell("F3").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell("G3").value = "ลาคลอดบุตร(วัน)";
  sheet.getCell("G3").alignment = { vertical: "middle", horizontal: "center" };
  sheet.getCell("G3").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell("H3").value = "ลาไปศึกษาต่อ(วัน)";
  sheet.getCell("H3").alignment = { vertical: "middle", horizontal: "center" };
  sheet.getCell("H3").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell("I3").value = "รวมวันลา(วัน)";
  sheet.getCell("I3").alignment = { vertical: "middle", horizontal: "center" };
  sheet.getCell("I3").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell("J3").value = "มาสาย/ครั้ง";
  sheet.getCell("J3").alignment = { vertical: "middle", horizontal: "center" };
  sheet.getCell("J3").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell("K3").value = "ขาดราชการ";
  sheet.getCell("K3").alignment = { vertical: "middle", horizontal: "center" };
  sheet.getCell("K3").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getRow(3).font = { size: 14 };

  sheet.getRow(1).height = 60;

  let row = 4;
  userData.forEach((user, index) => {
    sheet.getRow(row).font = { size: 14 };
    sheet.getCell(`A${row}`).value = `${arabicToThaiNumerals(index + 1)}`;
    sheet.getCell(`A${row}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    sheet.getCell(`A${row}`).border = {
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    sheet.getCell(
      `B${row}`
    ).value = `${user.prefix} ${user.name} ${user.surname}\n${user.position}`;
    sheet.getCell(`B${row}`).alignment = {
      vertical: "middle",
      horizontal: "left",
    };
    sheet.getCell(`B${row}`).border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    sheet.getCell(`C${row}`).value = `${arabicToThaiNumerals(
      user.statistics[0]?.leave_count
    )}`;
    sheet.getCell(`C${row}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    sheet.getCell(`C${row}`).border = {
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    sheet.getCell(`D${row}`).value = `${arabicToThaiNumerals(
      user.statistics[0]?.SL_In_Range
    )}`;
    sheet.getCell(`D${row}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    sheet.getCell(`D${row}`).border = {
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    sheet.getCell(`E${row}`).value = `${arabicToThaiNumerals(
      user.statistics[0]?.PL_In_Range
    )}`;
    sheet.getCell(`E${row}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    sheet.getCell(`E${row}`).border = {
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    sheet.getCell(`F${row}`).value = `${arabicToThaiNumerals(
      user.statistics[0]?.OL_In_Range
    )}`;
    sheet.getCell(`F${row}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    sheet.getCell(`F${row}`).border = {
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    sheet.getCell(`G${row}`).value = `${arabicToThaiNumerals(
      user.statistics[0]?.ML_In_Range
    )}`;
    sheet.getCell(`G${row}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    sheet.getCell(`G${row}`).border = {
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    sheet.getCell(`H${row}`).value = `${arabicToThaiNumerals(
      user.statistics[0]?.STL_In_Range
    )}`;

    sheet.getCell(`H${row}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    sheet.getCell(`H${row}`).border = {
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    sheet.getCell(`I${row}`).value = `${arabicToThaiNumerals(
      user.statistics[0]?.total_leaveDay
    )}`;
    sheet.getCell(`I${row}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    sheet.getCell(`I${row}`).border = {
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    sheet.getCell(`K${row}`).border = {
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    sheet.getCell(`J${row}`).border = {
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    row++;
  });

  const lastRow = row;

  sheet.getCell(`A${lastRow - 1}`).border = {
    right: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
  };
  sheet.getCell(`B${lastRow - 1}`).border = {
    right: { style: "thin" },
    bottom: { style: "thin" },
  };

  sheet.getCell(`C${lastRow - 1}`).border = {
    right: { style: "thin" },
    bottom: { style: "thin" },
  };
  sheet.getCell(`D${lastRow - 1}`).border = {
    right: { style: "thin" },
    bottom: { style: "thin" },
  };
  sheet.getCell(`E${lastRow - 1}`).border = {
    right: { style: "thin" },
    bottom: { style: "thin" },
  };
  sheet.getCell(`F${lastRow - 1}`).border = {
    right: { style: "thin" },
    bottom: { style: "thin" },
  };
  sheet.getCell(`G${lastRow - 1}`).border = {
    right: { style: "thin" },
    bottom: { style: "thin" },
  };
  sheet.getCell(`H${lastRow - 1}`).border = {
    right: { style: "thin" },
    bottom: { style: "thin" },
  };
  sheet.getCell(`I${lastRow - 1}`).border = {
    right: { style: "thin" },
    bottom: { style: "thin" },
  };
  sheet.getCell(`J${lastRow - 1}`).border = {
    right: { style: "thin" },
    bottom: { style: "thin" },
  };
  sheet.getCell(`K${lastRow - 1}`).border = {
    right: { style: "thin" },
    bottom: { style: "thin" },
  };

  row = lastRow + 3;
  sheet.getCell(`D${row}`).value = `(ลงชื่อ)`;
  sheet.getRow(row).font = { size: 14 };
  sheet.getCell(
    `F${row + 2}`
  ).value = `(${inspector.prefix} ${inspector.name} ${inspector.surname})`;
  sheet.getRow(row + 2).font = { size: 14 };
  sheet.getCell(`E${row + 3}`).value = `${inspector.position}`;
  sheet.getRow(row + 3).font = { size: 14 };

  const imageBuffer = await axios.get(inspectorSignature, {
    responseType: "arraybuffer",
  });
  const imageId2 = workbook.addImage({
    buffer: imageBuffer.data,
    extension: "png",
    ext: { width: 400, height: 100 },
  });

  sheet.addImage(imageId2, `G${row - 1}:G${row}`);

  workbook.xlsx.writeBuffer().then(function (data) {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "download.xlsx";
    anchor.click();
    window.URL.revokeObjectURL(url);
  });
};

export default ExcelGenerator;
