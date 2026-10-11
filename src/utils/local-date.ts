// "YYYY-MM-DD" in the user's own time zone; toISOString() would give yesterday's date before 05:30 in India
export const localDateString = (date: Date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
