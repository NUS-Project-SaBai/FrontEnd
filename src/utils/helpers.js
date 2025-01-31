// convert base64 url screenshot to file
export function urltoFile(url, filename, mimeType) {
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename, { type: mimeType });
    });
}

export function patientAge(dob) {
  const birth = new Date(dob);
  const today = new Date();

  // Calculate the difference in years
  let ageYears = today.getFullYear() - birth.getFullYear();

  // Calculate the difference in months
  let ageMonths = today.getMonth() - birth.getMonth();

  // Calculate the difference in days
  let ageDays = today.getDate() - birth.getDate();

  // Adjust for the case when the birthday hasn't occurred yet this year
  if (ageMonths < 0 || (ageMonths === 0 && ageDays < 0)) {
    ageYears--;
    ageMonths += 12; // Add 12 months if the birthday hasn't occurred yet this year
  }

  // Adjust days if the day difference is negative
  if (ageDays < 0) {
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Get the last day of the previous month
    ageDays += lastMonth.getDate(); // Add the number of days in the last month
    ageMonths--; // Subtract one month
    if (ageMonths < 0) {
      ageMonths = 11; // If months go negative, set it to 11 and subtract one year
      ageYears--;
    }
  }
  return {
    year: ageYears,
    month: ageMonths,
    day: ageDays,
  };
}
