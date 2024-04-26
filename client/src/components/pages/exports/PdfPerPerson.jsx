import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { font } from "./THSarabun-normal";
import { fontBold } from "./THSarabun Bold-bold";

const PdfPerPerson = ({ allDataArray, userData }) => {
  console.log("allDataArray: ", allDataArray);
  console.log("userData: ", userData);

  const formatLeaveDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "th-TH",
      options
    );
    return formattedDate;
  };

  const pdf = new jsPDF("l", "px", "a4");
  pdf.addFileToVFS("MyFont.ttf", font);
  pdf.addFont("MyFont.ttf", "MyFont", "normal");

  pdf.addFileToVFS("MyFontBold.ttf", fontBold);
  pdf.addFont("MyFontBold.ttf", "MyFontBold", "bold");
  const header = [];
  allDataArray.map((data) => {
    if (data[0] === null) {
      header.push([
        ``,
        data[1].VL_accumulatedDays,
        data[1].leave_rights,
        data[1].VL_total,
        `${data[1].VL_lastLeave !== 0 ? data[1].VL_lastLeave : ""}`,
        `${data[1].VL_thisLeave !== 0 ? data[1].VL_thisLeave : ""}`,
        `${data[1].VL_remaining !== 0 ? data[1].VL_remaining : ""}`,
        ``,
        ``,
        ``,
        ``,
        ``,
        ``,
        ``,
        ``,
      ]);
    } else {
      switch (data[0].topic) {
        case "ขอลาป่วย":
          header.push([
            `${formatLeaveDate(data[0].firstDay)} - ${formatLeaveDate(
              data[0].lastDay
            )}`,
            ``,
            ``,
            ``,
            ``,
            ``,
            ``,
            data[1].SL_lastLeave,
            data[1].SL_thisLeave,
            data[1].SL_remaining,
            ``,
            ``,
            ``,
            `http://localhost:5432/signatures/${data[2]}`,
            data[0].sickleave.reason,
          ]);
          break;
        case "ขอลากิจ":
          header.push([
            `${formatLeaveDate(data[0].firstDay)} - ${formatLeaveDate(
              data[0].lastDay
            )}`,
            ``,
            ``,
            ``,
            ``,
            ``,
            ``,
            ``,
            ``,
            ``,
            data[1].PL_lastLeave,
            data[1].PL_thisLeave,
            data[1].PL_remaining,
            `http://localhost:5432/signatures/${data[2]}`,
            ``,
          ]);
          break;
        case "ขอลาพักผ่อน":
          header.push([
            `${formatLeaveDate(data[0].firstDay)} - ${formatLeaveDate(
              data[0].lastDay
            )}`,
            ``,
            ``,
            ``,
            data[1].VL_lastLeave,
            data[1].VL_thisLeave,
            data[1].VL_remaining,
            ``,
            ``,
            ``,
            ``,
            ``,
            ``,
            `http://localhost:5432/signatures/${data[2]}`,
            ``,
          ]);
          break;
        case "ขอยกเลิกวันลา":
          header.push([
            `${formatLeaveDate(data[0].cancelFirstDay)} - ${formatLeaveDate(
              data[0].cancelLastDay
            )}`,
            ``,
            ``,
            ``,
            data[1].VL_lastLeave,
            data[1].VL_thisLeave,
            data[1].VL_remaining,
            ``,
            ``,
            ``,
            ``,
            ``,
            ``,
            `http://localhost:5432/signatures/${data[2]}`,
            `ยกเลิกลาพักผ่อน ${data[0].cancelNumDay}วัน`,
          ]);
          break;
      }
    }
  });
  header.push([
    `ยกยอดไป`,
    ``,
    `10`,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
  ]);
  console.log("header", header);
  let width = pdf.internal.pageSize.getWidth();
  pdf.setFont("MyFontBold", "bold");
  pdf.setFontSize(20);
  pdf.text(
    `ทะเบียนคุมวันลา ประจำปีงบประมาณ ${allDataArray[0][1].fiscal_year}`,
    width / 2,
    23,
    {
      align: "center",
    }
  );
  pdf.text(
    `ชื่อ ${userData.prefix} ${userData.name} ${userData.surname} ตำแหน่ง ${userData.position}`,
    width / 2,
    45,
    {
      align: "center",
    }
  );

  let head = [
    [
      { content: "ว.ด.ป ที่ลา", rowSpan: 2, styles: { halign: "center" } },
      { content: "ลาพักผ่อน", colSpan: 6, styles: { halign: "center" } },
      { content: "ลาป่วย", colSpan: 3, styles: { halign: "center" } },
      { content: "ลากิจส่วนตัว", colSpan: 3, styles: { halign: "center" } },
      { content: "ผู้ตรวจสอบ", rowSpan: 2, styles: { halign: "center" } },
      { content: "หมายเหตุ", rowSpan: 2, styles: { halign: "center" } },
    ],
    [
      "วันลาสะสม\n(วัน)",
      "สิทธิ์วันลา\n(วัน)",
      "รวม\n(วัน)",
      "ลามาแล้ว\n(วัน)",
      "ลาครั้งนี้\n(วัน)",
      "คงเหลือ\n(วัน)",
      "ลามาแล้ว\n(วัน)",
      "ลาครั้งนี้\n(วัน)",
      "คงเหลือ\n(วัน)",
      "ลามาแล้ว\n(วัน)",
      "ลาครั้งนี้\n(วัน)",
      "คงเหลือ\n(วัน)",
      "ผู้ตรวจสอบ",
      "หมายเหตุ",
    ],
  ];

  const body = header?.map((item, index) => [
    item[0],
    item[1],
    item[2],
    item[3],
    item[4],
    item[5],
    item[6],
    item[7],
    item[8],
    item[9],
    item[10],
    item[11],
    item[12],
    "",
    item[14],
  ]);

  pdf.setFont("MyFontBold", "bold");
  pdf.autoTable({
    startY: 60,
    head: head,
    body: body,
    theme: "grid",
    styles: { fillColor: null, lineWidth: 0.5 },
    headStyles: {
      textColor: `#000000`,
      fontSize: 16, // Adjust the font size as needed
      font: "MyFontBold", // Set the font family
    },
    bodyStyles: {
      textColor: `#000000`,
      fontSize: 14, // Adjust the font size as needed
      font: "MyFont", // Set the font family
    },
  });

  // Save the PDF
  // pdf.save(`sickLeave.pdf`);
  window.open(pdf.output("bloburl"), "_blank");

  // pdf open in a new tab
  const pdfDataUri = pdf.output("datauristring");
  const newTab = window.open();
  newTab?.document.write(
    `<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`
  );
};

export default PdfPerPerson;
