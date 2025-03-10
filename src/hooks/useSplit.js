export const useSplit = (installments, setInstallments) => {
  const handleSplitInstallment = (id) => {
    if (!id) {
      return;
    }

    const installmentToSplit = installments.find(inst => inst.id === id);
    if (!installmentToSplit) {
      return;
    }

    const key = "installmentNumber";
    const installmentValue = installmentToSplit[key].toString();

    if (installmentValue.includes(".")) {
      return;
    }

    const splitAmount = parseFloat((installmentToSplit.amount / 2).toFixed(10));

    const newId1 = Date.now();
    const newId2 = Date.now() + 1;


    const splitInstallment1 = {
      ...installmentToSplit,
      id: newId1,
      [key]: `${installmentValue}.1`,
      amount: splitAmount,
      dueDate: installmentToSplit.dueDate,
      show: true,
      splitFrom: installmentToSplit.id,
      selected: false,
    };

    const splitInstallment2 = {
      ...installmentToSplit,
      id: newId2,
      [key]: `${installmentValue}.2`,
      amount: splitAmount,
      dueDate: "",
      show: true,
      splitFrom: installmentToSplit.id,
      selected: false,
    };

    // Hide the original installment
    const updatedInstallments = installments.map(inst =>
      inst.id === installmentToSplit.id ? { ...inst, show: false, selected: false } : inst
    );

    // Add the new split installments
    updatedInstallments.push(splitInstallment1, splitInstallment2);

    // Sort installments by installmentNumber
    updatedInstallments.sort((a, b) => {
      const aVal = a[key].toString();
      const bVal = b[key].toString();
      const aNum = aVal.includes(".") ? parseFloat(aVal) : parseInt(aVal, 10);
      const bNum = bVal.includes(".") ? parseFloat(bVal) : parseInt(bVal, 10);
      return aNum - bNum;
    });

    setInstallments(updatedInstallments);
  };

  const handleUnsplitInstallment = (id) => {
    const installmentToUnsplit = installments.find(inst => inst.id === id);
    if (!installmentToUnsplit || !installmentToUnsplit.splitFrom) {
      return;
    }

    const key = "installmentNumber";
    const originalId = installmentToUnsplit.splitFrom;
    let restoredInstallment = null;

    // Remove both split installments and the hidden original, then restore the original installment
    const filteredInstallments = installments.filter(inst => {
      if (inst.id === originalId) {
        restoredInstallment = { ...inst, show: true, selected: false };
        return false;
      }
      if (inst.splitFrom && inst.splitFrom === originalId) {
        return false;
      }
      return true;
    });

    if (!restoredInstallment) {
      return;
    }

    filteredInstallments.push(restoredInstallment);

    // Sort the restored list
    filteredInstallments.sort((a, b) => {
      const aVal = a[key].toString();
      const bVal = b[key].toString();
      const aNum = aVal.includes(".") ? parseFloat(aVal) : parseInt(aVal, 10);
      const bNum = bVal.includes(".") ? parseFloat(bVal) : parseInt(bVal, 10);
      return aNum - bNum;
    });

    setInstallments(filteredInstallments);
  };

  return {
    handleSplitInstallment,
    handleUnsplitInstallment,
  };
};
