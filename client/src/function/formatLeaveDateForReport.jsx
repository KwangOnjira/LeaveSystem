export const formatLeaveDateForReport = (dateString) => {
  if (!dateString) return "-"; // Return default value if dateString is undefined or empty

  const options = { day: "numeric", month: "short", year: "numeric" };
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "-"; // Return default value if date is invalid
  }

  const formattedDate = date.toLocaleDateString("th-TH", options);
  return formattedDate;
};