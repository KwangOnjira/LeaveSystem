import { intervalToDuration } from "date-fns";

export const calculateYear = (date) =>{
    const currentDate = new Date();
    const startOfWorkDate = new Date(date);
    const duration = intervalToDuration({ start: startOfWorkDate, end: currentDate });

      console.log(duration)

      const durationString = [
        duration.years !== undefined ? `${duration.years} ปี` : null,
        duration.months !== undefined ? `${duration.months} เดือน` : null,
        duration.days !== undefined ? `${duration.days} วัน` : null,
      ].filter(Boolean).join(', ');

      return durationString
  }