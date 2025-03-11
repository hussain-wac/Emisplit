import { useState } from "react";
import { toast } from "react-toastify";

export const useInstallmentTableLogic = (installments, setInstallments) => {
  const [dateError, setDateError] = useState({});
  const [startDate, setStartDate] = useState(null);
  const safeToISOString = (dateStr) => {
    if (!dateStr) return null;
    const dateObj = new Date(dateStr);
    return isNaN(dateObj.getTime())
      ? null
      : dateObj.toISOString().split("T")[0];
  };

  const getShownSortedInstallments = (installs) =>
    installs
      .filter((i) => i.show)
      .sort((a, b) => {
        const numA = a.installmentNumber.includes(".")
          ? parseFloat(a.installmentNumber)
          : parseInt(a.installmentNumber, 10);
        const numB = b.installmentNumber.includes(".")
          ? parseFloat(b.installmentNumber)
          : parseInt(b.installmentNumber, 10);
        return numA - numB;
      });

  const sortedInstallments = getShownSortedInstallments(installments);

  const handleDateChange = (id, event) => {
    const newDate = event.target.value;
    const updatedInstallments = [...installments];

    const shownSorted = getShownSortedInstallments(updatedInstallments);

    const targetIndex = shownSorted.findIndex((inst) => inst.id === id);
    if (targetIndex === -1) return;

    if (targetIndex === 0) {
      setStartDate(newDate);
      shownSorted.forEach((inst, idx) => {
        const dueDate = new Date(newDate);
        dueDate.setMonth(dueDate.getMonth() + idx);
        const originalIndex = updatedInstallments.findIndex(
          (item) => item.id === inst.id
        );
        if (originalIndex !== -1) {
          updatedInstallments[originalIndex].dueDate = dueDate
            .toISOString()
            .split("T")[0];
        }
      });
      setInstallments(updatedInstallments);
      toast.success("Installments dates filled sequentially.");
      return;
    }
    const prevInst = targetIndex > 0 ? shownSorted[targetIndex - 1] : null;
    const nextInst =
      targetIndex < shownSorted.length - 1
        ? shownSorted[targetIndex + 1]
        : null;

    const newDateObj = new Date(newDate);
    const prevDateObj = prevInst ? new Date(prevInst.dueDate) : null;
    const nextDateObj = nextInst ? new Date(nextInst.dueDate) : null;

    if (
      (prevDateObj && newDateObj <= prevDateObj) ||
      (nextDateObj && newDateObj >= nextDateObj)
    ) {
      toast.error(
        "Invalid date selection. The due date must be strictly between the previous and next installment."
      );
      setDateError((prev) => ({
        ...prev,
        [id]: "Invalid date selection.",
      }));
      return;
    }
    const originalTargetIndex = updatedInstallments.findIndex(
      (inst) => inst.id === id
    );
    if (originalTargetIndex !== -1) {
      updatedInstallments[originalTargetIndex].dueDate = newDate;
      setInstallments(updatedInstallments);
      toast.success("Due date updated successfully.");
      setDateError((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors[id];
        return updatedErrors;
      });
    }
  };
  const getMinMaxDate = (id) => {
    const shownSorted = getShownSortedInstallments(installments);
    const targetIndex = shownSorted.findIndex((inst) => inst.id === id);
    let minDate = null,
      maxDate = null;
    if (targetIndex > 0) {
      minDate = safeToISOString(shownSorted[targetIndex - 1].dueDate);
    }
    if (targetIndex < shownSorted.length - 1) {
      maxDate = safeToISOString(shownSorted[targetIndex + 1].dueDate);
    }
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
