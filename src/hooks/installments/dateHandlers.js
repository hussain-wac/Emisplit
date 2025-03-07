// dateHandlers.js
export const handleDateChange = (index, date, dueDates, selectedDates) => {
    const newDueDates = [...dueDates];
  
    // If it's the first selection, prefill all future installments sequentially.
    if (!dueDates.some(d => d !== null)) {
      for (let i = index; i < newDueDates.length; i++) {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + (i - index));
        newDueDates[i] = newDate;
      }
    } else {
      newDueDates[index] = date;
    }
  
    const updatedSelectedDates = [...selectedDates];
    updatedSelectedDates[index] = date;
  
    return { newDueDates, updatedSelectedDates };
  };
  
  export const validateDate = (date, index, dueDates, selectedDates) => {
    const today = new Date();
    const selectedDate = new Date(date);
  
    // Check for a valid date and ensure it's not in the past.
    if (isNaN(selectedDate.getTime()) || selectedDate < today) {
      return false;
    }
  
    // Disallow selection of dates already chosen in another installment.
    const isDateSelectedElsewhere = selectedDates.some((selDate, i) => {
      if (!selDate) return false;
      return (
        i !== index &&
        selDate.getDate() === selectedDate.getDate() &&
        selDate.getMonth() === selectedDate.getMonth() &&
        selDate.getFullYear() === selectedDate.getFullYear()
      );
    });
    if (isDateSelectedElsewhere) {
      return false;
    }
  
    // If a previous installment exists, ensure selectedDate is at least one day after it.
    if (index > 0 && dueDates[index - 1]) {
      const minAllowed = new Date(dueDates[index - 1]);
      minAllowed.setDate(minAllowed.getDate() + 1);
      if (selectedDate < minAllowed) {
        return false;
      }
    }
  
    // If a next installment exists, ensure selectedDate is at most one day before it.
    if (index < dueDates.length - 1 && dueDates[index + 1]) {
      const maxAllowed = new Date(dueDates[index + 1]);
      maxAllowed.setDate(maxAllowed.getDate() - 1);
      if (selectedDate > maxAllowed) {
        return false;
      }
    }
  
    return true;
  };
  