export const useInstallmentTableLogic = (installments, setInstallments) => {
  const sortedInstallments = [...installments].sort((a, b) => {
    const numA = a.installmentNumber.includes(".")
      ? parseFloat(a.installmentNumber)
      : parseInt(a.installmentNumber, 10);
    const numB = b.installmentNumber.includes(".")
      ? parseFloat(b.installmentNumber)
      : parseInt(b.installmentNumber, 10);
    return numA - numB;
  });

  const handleDateChange = (index, event) => {
    const updatedInstallments = [...sortedInstallments];
    const newDate = new Date(event.target.value);

    const prevDate = index > 0 ? new Date(updatedInstallments[index - 1].dueDate) : null;
    const nextDate =
      index < updatedInstallments.length - 1
        ? new Date(updatedInstallments[index + 1].dueDate)
        : null;

    if (
      (prevDate && newDate <= prevDate) || 
      (nextDate && newDate >= nextDate)    
    ) {
      return "Invalid date selection. The due date must be strictly between the previous and next installment.";
    }

    updatedInstallments[index].dueDate = event.target.value;

    setInstallments(updatedInstallments);
  };

  return {
    sortedInstallments,
    handleDateChange,
  };
};