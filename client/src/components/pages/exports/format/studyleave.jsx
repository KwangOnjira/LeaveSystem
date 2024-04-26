import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { font } from "../THSarabun-normal";
import { fontBold } from "../THSarabun Bold-bold";
import dayjs from "dayjs";

const studyleave = ({
  userData,
  leaveData,
  userSignature,
  firstSignature,
  secondSignature,
  prevStat,
}) => {
  console.log("User data:", userData);
  console.log("leaveData:", leaveData);
  console.log("leaveData[0].leaveID:", leaveData[0].leaveID);
  console.log("userSignature:", userSignature);
  console.log("firstSignature:", firstSignature);
  console.log("secondSignature:", secondSignature);
  console.log("prevStat:", prevStat);

  const formatLeaveDate = (dateString) => {
    if (!dateString) return "-"; // Return default value if dateString is undefined or empty

    const options = { day: "numeric", month: "short", year: "numeric" };
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "-"; // Return default value if date is invalid
    }

    const formattedDate = date.toLocaleDateString("th-TH", options);
    return formattedDate;
  };

  const formatCurrentDate = (dateString) => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat("th-TH", options).format(
      date
    );

    return formattedDate;
  };

  const formatNumberWithCommas = (numberString) => {
    if (typeof numberString === "undefined") return "undefined"; // Return empty string if input is undefined
    const number = parseFloat(numberString); // Convert string to number
    if (isNaN(number)) return "isNaN"; // Return empty string if conversion fails
    return number.toLocaleString("en-US"); // Format number with commas
  };

  const calculateDateDifference = () => {
    if (leaveData[0].firstDay && leaveData[0].lastDay) {
      const startDate = dayjs(leaveData[0].firstDay);
      const endDate = dayjs(leaveData[0].lastDay);

      const diffMonths = endDate.diff(startDate, "month", true); // Use 'true' to get a floating-point result

      const years = Math.floor(diffMonths / 12);
      const remainingMonthsAfterYears = diffMonths % 12;
      const months = Math.floor(remainingMonthsAfterYears);
      const days =
        Math.round(
          (remainingMonthsAfterYears - months) * endDate.daysInMonth()
        ) + 1;
      return {
        years,
        months,
        days,
      };
    }

    return {
      years: 0,
      months: 0,
      days: 0,
    };
  };

  const pdf = new jsPDF();

  pdf.addFileToVFS("MyFont.ttf", font);
  pdf.addFont("MyFont.ttf", "MyFont", "normal");

  pdf.addFileToVFS("MyFontBold.ttf", fontBold);
  pdf.addFont("MyFontBold.ttf", "MyFontBold", "bold");

  let width = pdf.internal.pageSize.getWidth();
  pdf.setFont("MyFontBold", "bold");
  pdf.setFontSize(20);
  pdf.text(`ใบลาไปศึกษา ฝึกอบรม ปฏิบัติการวิจัย หรือดูงาน`, width / 2, 23, {
    align: "center",
  });
  pdf.setFont("MyFont", "normal");
  pdf.setFontSize(16);
  pdf.text(`เขียนที่ องค์การบริหารส่วนจังหวัดลำปาง`, 130, 35);
  pdf.text(`${formatCurrentDate(leaveData[0].date)}`, 130, 42);
  pdf.text(`เรื่อง ขออนุญาตลาอุปสมบท`, 25, 49);
  pdf.text(`เรียน ${leaveData[0].to}`, 25, 56);
  pdf.text(
    `               ข้าพเจ้า........................................................... ตำแหน่ง.............................................................................  ระดับ...............................................................   สังกัด.................................................................................................. เกิดวันที่................................ เข้ารับราชการเมื่อวันที่................................ ได้เงินเดือน เดือนละ.............................บาท (.........................................................................................................) มีความประสงค์ขอลาไป`,
    25,
    63,
    { maxWidth: 170 }
  );
  const checked =
    "data:image/png;base64,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";
  const blank =
    "data:image/png;base64,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T8bXrX6UAJvjDY1fdz9u9aPccL4CqEeMHqDlPdoAs/j10QO0XImYmgCoB48eoHrl6AEA9tGrRg9QPWj0AKMJgPGXga6t3jx4BoD99PeN/8nzJvzjbygBUA8cvP/LWr6PApjFTsvaN9Lof/wNJwCWp1ON5LGUwIxGr31nDd7/cAKgzhy8/7cO3j/ACG8bvP/Ra/9wAmB5MtVIVw7eP8AIbx+8fwEweoANcM/B+x99IwzACKPXvtFr/3ACoA4P3v8tg/cPMMLote/UwfsfTgCMD4D3Dd4/wAgCYDDPQh7/Ezz/GwCzsv4O5AoAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIAADAhAQAAExIANSHBu//8OD9A4xw6uD9j177hxMAdevg/Z8+eP8AI5wxeP8fGLz/4QTA+AAY/X8CgBFGr30CYPQAG+A/Bu///oP3DzDC6LVv9No/nACoGwbv/xMH7x9ghIcN3v/1g/c/nACo6wbvf/T/CQBGGL32jV77hxMA40+C8wfvH2CE8wbv3xWA0QNsgH8evP/HV4cGzwCwn05pWftGumbw/ocTAONPgrMbX8IA++lRjb8J8JrB+x9OANTVoweonjh6AIB9dNHoAdqMtZ/BHlLtDN4uX/0oATbHGxu/7n7s6kfJxjtU3dT4k9HNgMAMzm38evve3HvlK4CWk+EfRw9RPX30AAD74JmjB6je1LL2T00ALDbhEvyzqvuOHgJgRfervnr0ENXfjh5gEwiAxWtGD9DyXOxvGD0EwIq+sfHvAKjNWPPZEA9o/HdSOy2PJT5r5WMFGOGclu/eR6+zO0dmgf/1tsaflDvVL659oAADvLDx6+tOm3HPFxvmJxp/Yu5Ut1UXrHysAPvpwpa1bfT6ulP96MrHyhb6vMafmLdv76juve7hAuyL+1RXNX5dvX17wrqHyzY6tc35fmqnesm6hwuwL3678evp7duN1eF1D5dt9cuNP0GP3p697uECrOrbGr+OHr390rqHyza7pPEn6NHbbdUz1jxggJVcWn2o8evo0dvnrnrEbLV7VP/W+JP06O3W6slrHjTAHvv8lrVr9Pp59Pav1d3XPGi233Maf6Lecftg9VVrHjTAHvnyNu/Df6f6/jUPmoPhoW3Oz1WO3m6rvmXF4wY4GYdavvPf1PXzIesdOgfJHzb+hL2z7WV5ZwCwWe5Vvbjx6+Odbb+33qFz0HxO40/YY21XVY9f7egBdu/C6p8avy4ea7twtaPnQPq7xp+0x9puq15Qnb3S8QMcyzktP53exEv+R2+vXesPwMH1hY0/cXez3Vh9T8trNgHWdmb1vW3Wg9OOtfkVFcftUHV540/e3W63VD9WnbfGHwOY3vnVc1vWmtHr3W63v1nlL8EUNun9AMezvaHlFwOPqk7Z878KMINTqkdX31q9sfHr2olsn7Pnf5UD5NDoAbbAH7bdl5Cuqy6r3ly9pXp7dUPL5bv3tfxeF5jT4er0lhf23K96WPXwliuJj6/uP260k/ab1VNHD7HJBMBde2h1RV4gAbAtbqke0fL0P+7E3UYPsAVuqM6oLhg9CAC78h3VK0cPselcAdidj6j+oeVqAACb64rqMS2PUOcY3CC2O/9ZPavlphIANtNt1dfkw39XfAWwe1e3PIL300cPAsD/64eq548eYlv4CuD4nFr9bcvP6wDYHK9teeSvf/3vkgA4fue1RMBHjh4EgGr5ufNjqn8ZPcg2cQ/A8bui+orcDwCwCXaqZ+bD/7i5B+DEvLXlp4GPHT0IwOSeU/3s6CG2kQA4ca9qeWLW+aMHAZjUi6qvzxXZE+IegJNzj+r3W94ZAMD+eXXLY9o/MHqQbSUATt4Z1Z9VnzJ6EIBJvL767Jb3mXCCBMDeuH/1Vy0v0gBgPVe1PJr9PaMH2XZ+BbA3rqsurq4cPQjAAXZl9YR8+O8JAbB3rqk+o+VhFADsrddXj6veOXqQg0IA7K3rqydWrxg9CMAB8uqWf/lfO3qQg0QA7L33VV/Q8vMUAE7OS6tLqptHD3LQeA7AOj5UvazlNcKPzc2WAMdrp+UhP97utxIfTOu7qPrV6pzRgwBsieuqp1d/NHqQg0wA7I+PqX6j5QYWAO7c66qnttxYzYp8BbA/bq5+peWS1oUJL4A72ql+uvqy6obBs0zBB9H++8zqZ1peKwxAvan6uuovRw8yE1cA9t87q+e1FO4F1aljxwEY5v3VD7a8Yv3qwbNMxxWAsT665S7Xrxg9CMA++4OWf/X/8+hBZuU5AGO9u/rKll8KuPQFzOC1LQ/1eUo+/IdyBWCzXFh9R14vDBw8r6u+Jz/t2xgCYDM9qvrm6tLcpwFsr53qT6ufqn5/8CzcgQDYbB/bEgFfWz1w8CwAu/Vv1Qurn295fS8bSABsh7u33Cfw1OqLqvuMHQfgw9xY/U714pZ/9f/32HG4KwJg+xxueZbAxUe2c8eOA0zsiurlR7bLqlvHjsPxEADb76NanidwQfVp1fnVvYdOBBxEN7U8sOfy6q+q11TvGToRJ0UAHEwPqh5RPfjIf39gdXZ15pHtni1fK5wxZjxgg9zScrn+/dX1R7b3VO9qeTjP1dVbWh5iBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf5n8AjwLgqMATHqwAAAAASUVORK5CYII=";

  if (leaveData[0].studyleave.typeStudy === "ศึกษา") {
    pdf.addImage(checked, "jpeg", 43, 86, 5.1, 5.1);

    pdf.text(
      `                    ศึกษาวิชา...................................................................................... ขั้นปริญญา.....................................  ณ สถานศึกษา.....................................................................................................   ประเทศ.......................................... ด้วยทุน..........................................................................................................................................................`,
      25,
      90,
      { maxWidth: 170 }
    );
    pdf.setFontSize(14);
    pdf.text(`${leaveData[0].studyleave.subject}`, 65, 89.5);
    pdf.text(`${leaveData[0].studyleave.degree}`, 162, 89.5);
    pdf.text(`${leaveData[0].studyleave.academy}`, 50, 95.8);
    pdf.text(`${leaveData[0].studyleave.countrystudy}`, 158, 95.8);
    pdf.text(`${leaveData[0].studyleave.scholarshipstudy}`, 40, 102.1);
  } else {
    pdf.addImage(blank, "jpeg", 43, 86, 5, 5);
    pdf.text(
      `                    ศึกษาวิชา...................................................................................... ขั้นปริญญา.....................................  ณ สถานศึกษา.....................................................................................................   ประเทศ.......................................... ด้วยทุน..........................................................................................................................................................`,
      25,
      90,
      { maxWidth: 170 }
    );
  }
  if (leaveData[0].studyleave.typeStudy === "ฝึกอบรม") {
    pdf.addImage(checked, "jpeg", 43, 108, 5.1, 5.1);
    pdf.addImage(blank, "jpeg", 68, 108.1, 5, 5);
    pdf.addImage(blank, "jpeg", 100, 108.1, 5, 5);
    pdf.setFontSize(14);
    pdf.text(`${leaveData[0].studyleave.address}`, 34, 118);
    pdf.text(`${leaveData[0].studyleave.countrytrain}`, 159, 118);
    pdf.text(`${leaveData[0].studyleave.scholartrain}`, 40, 124.5);
  } else if (leaveData[0].studyleave.typeStudy === "ปฏิบัติการวิจัย") {
    pdf.addImage(blank, "jpeg", 43, 108.1, 5, 5);
    pdf.addImage(checked, "jpeg", 68, 108, 5.1, 5.1);
    pdf.addImage(blank, "jpeg", 100, 108.1, 5, 5);
    pdf.setFontSize(14);
    pdf.text(`${leaveData[0].studyleave.address}`, 34, 118);
    pdf.text(`${leaveData[0].studyleave.countrytrain}`, 159, 118);
    pdf.text(`${leaveData[0].studyleave.scholartrain}`, 40, 124.5);
  } else if (leaveData[0].studyleave.typeStudy === "ดูงาน") {
    pdf.addImage(blank, "jpeg", 43, 108.1, 5, 5);
    pdf.addImage(blank, "jpeg", 68, 108.1, 5, 5);
    pdf.addImage(checked, "jpeg", 100, 108, 5.1, 5.1);
    pdf.setFontSize(14);
    pdf.text(`${leaveData[0].studyleave.course}`, 155, 111.5);
    pdf.text(`${leaveData[0].studyleave.address}`, 34, 118);
    pdf.text(`${leaveData[0].studyleave.countrytrain}`, 159, 118);
    pdf.text(`${leaveData[0].studyleave.scholartrain}`, 40, 124.5);
  } else {
    pdf.addImage(blank, "jpeg", 43, 108.1, 5, 5);
    pdf.addImage(blank, "jpeg", 68, 108.1, 5, 5);
    pdf.addImage(blank, "jpeg", 100, 108.1, 5, 5);
  }
  pdf.setFontSize(16);
  pdf.text(
    `                    ฝึกอบรม         ปฏิบัติการวิจัย         ดูงาน ด้าน/หลักสูตร ขั้นปริญญา.............................................  ณ ........................................................................................................................   ประเทศ.......................................... ด้วยทุน............................................................................................................................................................................`,
    25,
    112,
    { maxWidth: 170 }
  );
  pdf.text(
    `ทั้งนี้ ตั้งแต่วันที่.......................................... ถึงวันที่ ..................................... มีกำหนด............ปี..........เดือน............วัน ในระหว่างลาจะติดต่อข้าพเจ้าได้ที่............................................................. หมายเลขโทรศัพท์......................................`,
    25,
    133,
    { maxWidth: 170 }
  );
  pdf.text(
    `               ข้าพเจ้าขอรับรองว่าจะปฏิบัติตามกฎหมายและระเบียบของทางราชการเกี่ยวกับการไปศึกษา ฝึกอบรม ปฏิบัติการวิจัย หรือดูงาน ทุกประการ`,
    25,
    148,
    { maxWidth: 170 }
  );

  pdf.setFontSize(14);
  pdf.text(`${userData.prefix} ${userData.name} ${userData.surname}`, 58, 62.5);
  pdf.text(`${userData.position}`, 126, 62.5);
  pdf.text(`${leaveData[0].studyleave.level}`, 39, 69);
  pdf.text(`${userData.divisionName}`, 107, 69);
  pdf.text(`${formatLeaveDate(userData.birthday)}`, 42, 75.5);
  pdf.text(`${formatLeaveDate(userData.start_of_work_on)}`, 105, 75.5);
  pdf.text(
    `${formatNumberWithCommas(leaveData[0].studyleave.salaryNumber)}`,
    165,
    75.5
  );
  pdf.text(`${leaveData[0].studyleave.salaryAlphabet}`, 30, 82);
  pdf.text(`${formatLeaveDate(leaveData[0].firstDay)}`, 51, 132);
  pdf.text(`${formatLeaveDate(leaveData[0].lastDay)}`, 102, 132);
  pdf.text(
    `${
        calculateDateDifference().years > 0 ? `${calculateDateDifference().years}` : '-'
      }`,
    152,
    132
  );
  pdf.text(
    `${
        calculateDateDifference().months > 0 ? `${calculateDateDifference().months}` : '-'
      }`,
    164,
    132
  );
  pdf.text(
    `${
        calculateDateDifference().days > 0 ? `${calculateDateDifference().days}` : '-'
      }`,
    181,
    132
  );
  pdf.text(
    `${leaveData[0].contact}`,
    76,
    139
  );
  pdf.text(
    `${userData.phone}`,
    161,
    139
  );

  pdf.setFontSize(16);
  pdf.text("ขอแสดงความนับถือ", 115, 160);
  pdf.addImage(userSignature, "jpeg", 126, 163, 10, 5);
  pdf.text(`(ลงชื่อ)...............................................`, 100, 169);
  pdf.text(
    `(    ${userData.prefix} ${userData.name} ${userData.surname}    )`,
    106,
    174
  );
  pdf.text(`ตำแหน่ง   ${userData.position}`, 100, 180);

  pdf.setFont("MyFontBold", "bold");
  pdf.text("ความเห็นของผู้บังคับบัญชา", 25, 186);

  pdf.setFont("MyFont", "normal");
  pdf.text(`      ${leaveData[0]?.comment ?? "-"}`, 25, 192, { maxWidth: 170 });
  pdf.text(
    `..................................................................................................................................................................................................................................................................................................................................................................................`,
    25,
    193,
    { maxWidth: 170 }
  );
  if (firstSignature) {
    pdf.addImage(firstSignature, "jpeg", 125, 203, 10, 5);
    pdf.text(
      `(ลงชื่อ)...............................................`,
      100,
      209
    );
    pdf.text(
      `(    ${leaveData[0].who_first_supeior.split("(")[0].trim()}    )`,
      104,
      216
    );
    pdf.text(
      `ตำแหน่ง.............................................................................................`,
      90,
      223,
    );
    pdf.setFontSize(14);
    pdf.text(
      `               ${leaveData[0].who_first_supeior
        .split("(")[1]
        .trim()
        .slice(0, -1)}`,
      90,
      222,
    );
    pdf.setFontSize(16);
    pdf.text(`วันที่...............................................`, 100, 229);
    pdf.text(
      `            ${formatLeaveDate(leaveData[0]?.date_first_supeior)}`,
      100,
      228
    );
  } else {
    pdf.text(
      `(ลงชื่อ)...............................................`,
      100,
      209
    );
    pdf.text(`-`, 40, 192, { maxWidth: 170 });
    pdf.text(
        `ตำแหน่ง...................................................................................`,
      90,
      223,
    );
    pdf.text(`(                                        )`, 104, 216);
    pdf.setFontSize(16);
    pdf.text(`วันที่...............................................`, 100, 229);
  }

  pdf.setFont("MyFontBold", "bold");
  pdf.text("คำสั่ง", 25, 238);

  pdf.setFont("MyFont", "normal");
  pdf.addImage(checked, "jpeg", 95, 239, 5.1, 5.1);
  pdf.addImage(blank, "jpeg", 118, 239, 5, 5);
  pdf.text(`อนุญาต          ไม่อนุญาต`, 102, 243);

  pdf.addImage(secondSignature, "jpeg", 125, 247, 10, 5);
  pdf.text(`(ลงชื่อ)...............................................`, 100, 253);
  pdf.text(
    `(    ${leaveData[0].who_second_supeior.split("(")[0].trim()}    )`,
    104,
    259
  );
  pdf.text(
    `ตำแหน่ง...................................................................................`,
    90,
    266,
  );
  pdf.setFontSize(14);
  pdf.text(
    `               ${leaveData[0].who_second_supeior
      .split("(")[1]
      .trim()
      .slice(0, -1)}`,
    90,
    265,
    { maxWidth: 70 }
  );
  pdf.setFontSize(16);
  pdf.text(`วันที่...............................................`, 100, 274);
  pdf.text(
    `            ${formatLeaveDate(leaveData[0].date_second_supeior)}`,
    100,
    273
  );

  // Save the PDF
  // pdf.save(`maternityleave.pdf`);
  window.open(pdf.output("bloburl"), "_blank");

  // pdf open in a new tab
  const pdfDataUri = pdf.output("datauristring");
  const newTab = window.open();
  newTab?.document.write(
    `<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`
  );
};
export default studyleave;
