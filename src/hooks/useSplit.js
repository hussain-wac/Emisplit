import { useState } from "react";

export const useSplit = (installments, setInstallments) => {
  const handleSplitInstallment = (id) => {
    const installmentToSplit = installments.find((inst) => inst.id === id);
    if (!installmentToSplit || installmentToSplit.installmentNum.includes(".")) {
      // Either no such installment or already split
      alert("Select a valid installment to split.");
      return;
    }

    const splitAmount = (installmentToSplit.amount / 2).toFixed(2);
    
    // Generate new installments
    const newInstallments = [
      {
        ...installmentToSplit,
        show: false,
      },
      {
        id: Date.now(), // Generate a unique ID for the split installment
        installmentNum: `${installmentToSplit.installmentNum}.1`,
        amount: parseFloat(splitAmount),
        show: true,
        splitFrom: installmentToSplit.id,
      },
      {
        id: Date.now() + 1, // Generate a unique ID for the second split installment
        installmentNum: `${installmentToSplit.installmentNum}.2`,
        amount: parseFloat(splitAmount),
        show: true,
        splitFrom: installmentToSplit.id,
      },
    ];

    // Update installments with the new split installments
    const updatedInstallments = installments.map((inst) =>
      inst.id === id ? { ...inst, show: false } : inst
    );
    updatedInstallments.push(...newInstallments);

    // Sort installments by their installment number
    updatedInstallments.sort((a, b) => {
      const numA = a.installmentNum.includes(".") ? parseFloat(a.installmentNum) : parseInt(a.installmentNum);
      const numB = b.installmentNum.includes(".") ? parseFloat(b.installmentNum) : parseInt(b.installmentNum);
      return numA - numB;
    });

    setInstallments(updatedInstallments);
  };

  const handleUnsplitInstallment = (id) => {
    const installmentToUnsplit = installments.find((inst) => inst.id === id);
    if (!installmentToUnsplit || !installmentToUnsplit.splitFrom) {
      alert("This installment was not split.");
      return;
    }

    const originalInstallment = installments.find((inst) => inst.id === installmentToUnsplit.splitFrom);
    if (!originalInstallment) return;

    const updatedInstallments = installments.filter(
      (inst) => inst.id !== installmentToUnsplit.id && inst.id !== id
    );

    const restoredInstallment = {
      ...originalInstallment,
      show: true,
      amount: originalInstallment.amount + installmentToUnsplit.amount,
    };

    updatedInstallments.push(restoredInstallment);

    setInstallments(updatedInstallments);
  };

  return {
    handleSplitInstallment,
    handleUnsplitInstallment,
  };
};
