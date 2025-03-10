import { useState } from 'react';

const initialInstallments = [
  { insnumber: '1', amount: 100, duedate: '2023-01-01', show: true, isMerged: false, isSplit: false, mergedFrom: [], splitFrom: null },
  { insnumber: '2', amount: 100, duedate: '2023-02-01', show: true, isMerged: false, isSplit: false, mergedFrom: [], splitFrom: null },
  { insnumber: '3', amount: 100, duedate: '2023-03-01', show: true, isMerged: false, isSplit: false, mergedFrom: [], splitFrom: null },
];

const useInstallmentLogic = () => {
  const [installments, setInstallments] = useState(initialInstallments);
  const [selectedInsNumbers, setSelectedInsNumbers] = useState([]);

  // Toggle selection of an installment, preventing selection of hidden or merged installments
  const toggleSelection = (insnumber) => {
    const installment = installments.find((inst) => inst.insnumber === insnumber);
    if (!installment || !installment.show || installment.isMerged) return; // Edge case: Invalid selection
    setSelectedInsNumbers((prev) =>
      prev.includes(insnumber) ? prev.filter((n) => n !== insnumber) : [...prev, insnumber]
    );
  };

  // Merge selected installments
  const handleMerge = () => {
    if (selectedInsNumbers.length < 2) {
      alert('Please select at least two installments to merge.');
      return;
    }

    const selected = installments.filter(
      (inst) => selectedInsNumbers.includes(inst.insnumber) && inst.show && !inst.isMerged
    );
    if (selected.length !== selectedInsNumbers.length) {
      alert('Some selected installments are not available for merging.');
      return; // Edge case: Hidden or merged installments selected
    }

    const totalAmount = selected.reduce((sum, inst) => sum + Number(inst.amount), 0);
    const mergedInsNumber = selectedInsNumbers.join(' + ');
    if (installments.some((inst) => inst.insnumber === mergedInsNumber)) {
      alert('Merged installment number already exists.');
      return; // Edge case: Duplicate insnumber
    }

    const mergedInstallment = {
      insnumber: mergedInsNumber,
      amount: totalAmount,
      duedate: selected[0].duedate, 
      show: true,
      isMerged: true,
      isSplit: false,
      mergedFrom: selectedInsNumbers,
      splitFrom: null,
    };

    setInstallments((prev) =>
      prev
        .map((inst) => (selectedInsNumbers.includes(inst.insnumber) ? { ...inst, show: false } : inst))
        .concat(mergedInstallment)
    );
    setSelectedInsNumbers([]);
  };

  // Unmerge a merged installment
  const handleUnmerge = (mergedInstallment) => {
    const { insnumber, mergedFrom } = mergedInstallment;
    const originalsExist = mergedFrom.every((num) =>
      installments.some((inst) => inst.insnumber === num)
    );
    if (!originalsExist) {
      alert('Cannot unmerge: Original installments are missing.');
      return; // Edge case: Originals deleted or corrupted
    }

    setInstallments((prev) =>
      prev.map((inst) => {
        if (mergedFrom.includes(inst.insnumber)) return { ...inst, show: true };
        if (inst.insnumber === insnumber) return { ...inst, show: false };
        return inst;
      })
    );
  };

  // Split a selected installment
  const handleSplit = () => {
    if (selectedInsNumbers.length !== 1) {
      alert('Please select exactly one installment to split.');
      return;
    }

    const insnumber = selectedInsNumbers[0];
    const installment = installments.find(
      (inst) => inst.insnumber === insnumber && inst.show && !inst.isMerged
    );
    if (!installment) {
      alert('Selected installment is not available for splitting.');
      return; // Edge case: Hidden or merged installment
    }

    const splitAmount = Number(installment.amount) / 2;
    const split1InsNumber = `${insnumber}.1`;
    const split2InsNumber = `${insnumber}.2`;
    if (
      installments.some((inst) => inst.insnumber === split1InsNumber) ||
      installments.some((inst) => inst.insnumber === split2InsNumber)
    ) {
      alert('Split installment numbers already exist.');
      return; // Edge case: Duplicate insnumber
    }

    const split1 = {
      insnumber: split1InsNumber,
      amount: splitAmount,
      duedate: installment.duedate,
      show: true,
      isMerged: false,
      isSplit: true,
      mergedFrom: [],
      splitFrom: insnumber,
    };
    const split2 = {
      insnumber: split2InsNumber,
      amount: splitAmount,
      duedate: null, // User could set this in a real app
      show: true,
      isMerged: false,
      isSplit: true,
      mergedFrom: [],
      splitFrom: insnumber,
    };

    setInstallments((prev) =>
      prev
        .map((inst) => (inst.insnumber === insnumber ? { ...inst, show: false } : inst))
        .concat([split1, split2])
    );
    setSelectedInsNumbers([]);
  };

  // Revert a split installment
  const handleRevertSplit = (splitInstallment) => {
    const { splitFrom } = splitInstallment;
    if (!splitFrom) {
      alert('Cannot revert: No original installment specified.');
      return; // Edge case: Corrupted splitFrom
    }

    const original = installments.find((inst) => inst.insnumber === splitFrom);
    if (!original) {
      alert('Cannot revert: Original installment is missing.');
      return; // Edge case: Original deleted
    }

    const splits = installments.filter((inst) => inst.splitFrom === splitFrom && inst.show);
    if (splits.length === 0) {
      alert('No split installments to revert.');
      return; // Edge case: No splits to revert
    }

    setInstallments((prev) =>
      prev.map((inst) => {
        if (inst.insnumber === splitFrom) return { ...inst, show: true };
        if (inst.splitFrom === splitFrom) return { ...inst, show: false };
        return inst;
      })
    );
  };

  return {
    installments,
    selectedInsNumbers,
    toggleSelection,
    handleMerge,
    handleUnmerge,
    handleSplit,
    handleRevertSplit,
  };
};

export default useInstallmentLogic;