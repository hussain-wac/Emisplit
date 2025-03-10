export const useInstallmentTableLogic = (installments, setInstallments) => {
    // Update the due date for a given installment
    const handleDateChange = (index, event) => {
      const updatedInstallments = [...installments];
      updatedInstallments[index].dueDate = event.target.value;
      setInstallments(updatedInstallments);
    };
  
    // Compute sorted installments based on installmentNumber on every render
    const sortedInstallments = [...installments].sort((a, b) => {
      const numA = a.installmentNumber.includes(".")
        ? parseFloat(a.installmentNumber)
        : parseInt(a.installmentNumber, 10);
      const numB = b.installmentNumber.includes(".")
        ? parseFloat(b.installmentNumber)
        : parseInt(b.installmentNumber, 10);
      return numA - numB;
    });
  
    return {
      sortedInstallments,
      handleDateChange,
    };
  };
  