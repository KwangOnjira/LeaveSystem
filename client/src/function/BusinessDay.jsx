import dayjs from "dayjs";

export const findBusinessDays = (startDate, endDate, holidays) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const first = dayjs(startDate).toDate();
  const last = dayjs(endDate).toDate();

  let businessDays = 0;

  while (first <= last) {
    // if (first instanceof Date && !isNaN(first)) {
      if (first.getDay() !== 0 && first.getDay() !== 6 && !isnotHoliday(first, holidays)) {
        businessDays++;
      }

      first.setDate(first.getDate() + 1);
    // } else {
    //   console.error("Invalid date:", first);
    //   break;
    // }
  }

  return businessDays;
};

export const isnotHoliday = (dateToCheck, holidays) => {
  for (let i = 0; i < holidays.length; i++) {
    const holiday = holidays[i];

    if (dayjs(dateToCheck).isSame(holiday.date, 'day')) {
      return true;
    }
  }

  return false;
};
