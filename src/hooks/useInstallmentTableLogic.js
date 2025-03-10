import { toast } from 'react-toastify';

export const useInstallmentTableLogic = (installments, setInstallments) => {
  // Update the due date for a given installment with validation
  const handleDateChange = (index, event) => {
    const updatedInstallments = [...installments];
    const newDate = event.target.value;

    const prevDate = index > 0 ? updatedInstallments[index - 1].dueDate : null;
    const nextDate =
      index < updatedInstallments.length - 1
        ? updatedInstallments[index + 1].dueDate
        : null;

    // Convert string dates to Date objects for validation
    const newDateObj = new Date(newDate);
    const prevDateObj = prevDate ? new Date(prevDate) : null;
    const nextDateObj = nextDate ? new Date(nextDate) : null;

    // Validate the new date
    if (
      (prevDateObj && newDateObj <= prevDateObj) || // Prevents selecting the same or earlier date
      (nextDateObj && newDateObj >= nextDateObj)    // Prevents selecting the same or later date
    ) {
      // Show error toast
      toast.error("Invalid date selection. The due date must be strictly between the previous and next installment.");
      return; // Exit early if the validation fails
    }

    updatedInstallments[index].dueDate = newDate; // Update the installment's due date
    setInstallments(updatedInstallments);

    // Show success toast
    toast.success("Due date updated successfully.");
  };

  // Compute sorted installments based on installmentNumber
  const sortedInstallments = [...installments].sort((a, b) => {
    const numA = a.installmentNumber.includes(".")
      ? parseFloat(a.installmentNumber)
      : parseInt(a.installmentNumber, 10);
    const numB = b.installmentNumber.includes(".")
      ? parseFloat(b.installmentNumber)
      : parseInt(b.installmentNumber, 10);
    return numA - numB;
  });

  // Function to return min and max date for each installment
  const getMinMaxDate = (index) => {
    const prevDate = index > 0 ? sortedInstallments[index - 1].dueDate : null;
    const nextDate =
      index < sortedInstallments.length - 1
        ? sortedInstallments[index + 1].dueDate
        : null;

    const minDate = prevDate ? new Date(prevDate).toISOString().split("T")[0] : null;
    const maxDate = nextDate ? new Date(nextDate).toISOString().split("T")[0] : null;

    return { minDate, maxDate };
  };

  return {
    sortedInstallments,
    handleDateChange,
    getMinMaxDate,
  };
};
