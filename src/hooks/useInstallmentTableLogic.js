import { useState } from "react";
import { toast } from "react-toastify";

export const useInstallmentTableLogic = (installments, setInstallments) => {
  const [dateError, setDateError] = useState({});
  const handleDateChange = (index, event) => {
    const updatedInstallments = [...installments];
    const newDate = event.target.value;

    const prevDate = index > 0 ? updatedInstallments[index - 1].dueDate : null;
    const nextDate =
      index < updatedInstallments.length - 1
        ? updatedInstallments[index + 1].dueDate
        : null;

    const newDateObj = new Date(newDate);
    const prevDateObj = prevDate ? new Date(prevDate) : null;
    const nextDateObj = nextDate ? new Date(nextDate) : null;

    if (
      (prevDateObj && newDateObj <= prevDateObj) ||
      (nextDateObj && newDateObj >= nextDateObj)
    ) {
      toast.error(
        "Invalid date selection. The due date must be strictly between the previous and next installment."
      );

      setDateError((prevErrors) => ({
        ...prevErrors,
        [index]: "Invalid date selection.",
      }));
      return;
    }

    updatedInstallments[index].dueDate = newDate;
    setInstallments(updatedInstallments);

    toast.success("Due date updated successfully.");

    setDateError((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[index];
      return updatedErrors;
    });
  };

  const sortedInstallments = [...installments].sort((a, b) => {
    const numA = a.installmentNumber.includes(".")
      ? parseFloat(a.installmentNumber)
      : parseInt(a.installmentNumber, 10);
    const numB = b.installmentNumber.includes(".")
      ? parseFloat(b.installmentNumber)
      : parseInt(b.installmentNumber, 10);
    return numA - numB;
  });

  const getMinMaxDate = (index) => {
    const prevDate = index > 0 ? sortedInstallments[index - 1].dueDate : null;
    const nextDate =
      index < sortedInstallments.length - 1
        ? sortedInstallments[index + 1].dueDate
        : null;

    const minDate = prevDate
      ? new Date(prevDate).toISOString().split("T")[0]
      : null;
    const maxDate = nextDate
      ? new Date(nextDate).toISOString().split("T")[0]
      : null;

    return { minDate, maxDate };
  };

  return {
    sortedInstallments,
    handleDateChange,
    getMinMaxDate,
    dateError,
    setDateError,
  };
};
