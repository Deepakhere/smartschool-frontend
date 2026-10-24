// "YYYY-MM-DD" in the user's own time zone; toISOString() would give yesterday's date before 05:30 in India
// today in India (the school's time zone) as "YYYY-MM-DD"
export const todayInIndia = () => new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);

export const localDateString = (date: Date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
