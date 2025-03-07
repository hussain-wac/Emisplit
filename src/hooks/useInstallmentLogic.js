import { useState } from 'react';

const useInstallmentLogic = () => {
  const [installments, setInstallments] = useState([
    { checked: false, insnumber: 1, amount: '100', duedate: '2023-01-01', show: true },
    { checked: false, insnumber: 2, amount: '100', duedate: '2023-02-01', show: true },
    { checked: false, insnumber: 3, amount: '100', duedate: '2023-03-01', show: true },
  ]);

  const [selectedIndexes, setSelectedIndexes] = useState([]);

  // Toggle selection
  const toggleSelection = (index) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
    setInstallments((prev) =>
      prev.map((inst, i) =>
        i === index ? { ...inst, checked: !inst.checked } : inst
      )
    );
  };

  // Merge selected installments
  const handleMerge = () => {
    if (selectedIndexes.length < 2) {
      alert('Select at least two installments to merge.');
      return;
    }

    const selected = selectedIndexes.map((idx) => installments[idx]);
    const totalAmount = selected
      .reduce((sum, inst) => sum + parseFloat(inst.amount), 0)
      .toFixed(2);
    const mergedInsNumber = selected.map((inst) => inst.insnumber).join(' + ');
    const mergedDueDate = selected[0].duedate;

    const mergedInstallment = {
      checked: false,
      insnumber: mergedInsNumber,
      amount: totalAmount,
      duedate: mergedDueDate,
      show: true,
      isMerged: true,
      originalIndexes: selectedIndexes,
    };

    setInstallments((prev) =>
      prev
        .map((inst, idx) =>
          selectedIndexes.includes(idx) ? { ...inst, show: false } : inst
        )
        .concat(mergedInstallment)
    );
    setSelectedIndexes([]);
  };

  // Unmerge an installment
  const handleUnmerge = (mergedInstallment) => {
    setInstallments((prev) =>
      prev
        .map((inst, idx) =>
          mergedInstallment.originalIndexes.includes(idx)
            ? { ...inst, show: true }
            : inst
        )
        .filter((inst) => inst.insnumber !== mergedInstallment.insnumber)
    );
  };

  // Split an installment
  const handleSplit = () => {
    if (selectedIndexes.length !== 1) {
      alert('Select exactly one installment to split.');
      return;
    }

    const index = selectedIndexes[0];
    const installment = installments[index];
    const splitAmount = (parseFloat(installment.amount) / 2).toFixed(2);

    const split1 = {
      checked: false,
      insnumber: `${installment.insnumber}.1`,
      amount: splitAmount,
      duedate: installment.duedate,
      show: true,
      isSplit: true,
      originalInsNumber: installment.insnumber,
    };
    const split2 = {
      checked: false,
      insnumber: `${installment.insnumber}.2`,
      amount: splitAmount,
      duedate: null,
      show: true,
      isSplit: true,
      originalInsNumber: installment.insnumber,
    };

    setInstallments((prev) =>
      prev
        .map((inst, idx) =>
          idx === index ? { ...inst, show: false } : inst
        )
        .concat([split1, split2])
    );
    setSelectedIndexes([]);
  };

  // Revert split
  const handleRevertSplit = (originalInsNumber) => {
    setInstallments((prev) =>
      prev
        .map((inst) =>
          inst.insnumber === originalInsNumber
            ? { ...inst, show: true }
            : inst.originalInsNumber === originalInsNumber
            ? { ...inst, show: false }
            : inst
        )
    );
  };

  return {
    installments,
    selectedIndexes,
    toggleSelection,
    handleMerge,
    handleUnmerge,
    handleSplit,
    handleRevertSplit,
  };
};

export default useInstallmentLogic;