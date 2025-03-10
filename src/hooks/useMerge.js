import { toast } from "react-toastify";

export const useMerge = (installments, setInstallments) => {
  const handleMergeInstallments = () => {
    const visibleSelected = installments.filter(
      (inst) => inst.selected && inst.show
    );

    if (visibleSelected.length < 2) {
      toast.error("Select at least two visible installments to merge.");
      return;
    }

    const sortedInstallments = visibleSelected.sort((a, b) => a.id - b.id);
    const isConsecutive = sortedInstallments.every((inst, index, arr) => {
      if (index === 0) return true;
      return (
        parseInt(inst.installmentNumber) ===
        parseInt(arr[index - 1].installmentNumber) + 1
      );
    });

    if (!isConsecutive) {
      toast.error("Only consecutive installments can be merged.");
      return;
    }

    const mergedAmount = visibleSelected.reduce(
      (total, inst) => total + inst.amount,
      0
    );

    const mergedInstallmentNumber = visibleSelected
      .map((inst) => inst.installmentNumber)
      .join("+");

    const firstVisibleSelected = visibleSelected[0];
    const mergedPosition = installments.findIndex(
      (inst) => inst.id === firstVisibleSelected.id
    );

    const maxId = Math.max(...installments.map((inst) => inst.id), 0) + 1;

    const mergedDueDate = firstVisibleSelected.dueDate || "";

    const newMergedInstallment = {
      id: maxId,
      installmentNumber: mergedInstallmentNumber,
      amount: mergedAmount,
      dueDate: mergedDueDate,
      selected: false,
      show: true,
      originalData: visibleSelected.map((inst) => ({
        ...inst,
        show: false,
      })),
      mergedPosition,
    };

    const updatedInstallments = [...installments];

    visibleSelected.forEach((inst) => {
      const index = updatedInstallments.findIndex((i) => i.id === inst.id);
      if (index !== -1) {
        updatedInstallments[index] = {
          ...updatedInstallments[index],
          show: false,
          selected: false,
        };
      }
    });

    updatedInstallments.splice(mergedPosition, 0, newMergedInstallment);

    setInstallments(updatedInstallments);
    toast.success("Installments merged successfully.");
  };

  const handleUnmergeInstallment = (mergedId) => {
    const mergedInstallment = installments.find((inst) => inst.id === mergedId);
    if (!mergedInstallment || !mergedInstallment.originalData) return;

    const updatedInstallments = [...installments];

    const indexToRemove = updatedInstallments.findIndex(
      (inst) => inst.id === mergedId
    );
    if (indexToRemove !== -1) {
      updatedInstallments.splice(indexToRemove, 1);
    }

    mergedInstallment.originalData.forEach((original) => {
      const originalIndex = updatedInstallments.findIndex(
        (inst) => inst.id === original.id
      );
      if (originalIndex !== -1) {
        updatedInstallments[originalIndex] = {
          ...updatedInstallments[originalIndex],
          show: true,
          selected: false,
        };
      }
    });

    setInstallments(updatedInstallments);
    toast.success("Installments unmerged successfully.");
  };

  return {
    handleMergeInstallments,
    handleUnmergeInstallment,
  };
};
