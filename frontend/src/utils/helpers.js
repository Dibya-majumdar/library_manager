// Format date to YYYY-MM-DD
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get date 15 days from now
export const getReturnDate = (issueDate) => {
  const date = new Date(issueDate);
  date.setDate(date.getDate() + 15);
  return date;
};

// Check if date is today or later
export const isDateValid = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate >= today;
};

// Check if return date is within 15 days of issue date
export const isReturnDateValid = (issueDate, returnDate) => {
  if (!issueDate || !returnDate) return false;
  const issue = new Date(issueDate);
  const returnD = new Date(returnDate);
  const diffTime = returnD - issue;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= 15 && diffDays >= 0;
};

// Calculate fine amount (10 per late day)
export const calculateFine = (expectedReturnDate, actualReturnDate) => {
  if (!expectedReturnDate || !actualReturnDate) return 0;
  const expected = new Date(expectedReturnDate);
  const actual = new Date(actualReturnDate);
  const diffTime = actual - expected;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays * 10 : 0;
};

