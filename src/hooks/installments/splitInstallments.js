// splitInstallments.js
import { toast } from 'react-toastify';

export const splitInstallment = (selectedInstallments, installments) => {
  if (selectedInstallments.length !== 1) {
    toast.error('Please select exactly one installment to split.');
    return { error: 'select one installment only' };
  }

  const index = selectedInstallments[0];
  const installment = installments[index];
  const splitCount = 2;
  const splitAmount = parseFloat(installment.amount) / splitCount;
  
  // Create split installments. (Customize installmentNo if needed.)
  const newSplits = Array(splitCount)
    .fill(null)
    .map(() => ({
      ...installment,
      amount: splitAmount.toFixed(2),
      installmentNo: `${installment.installmentNo}.${1}`,
      isSplit: true,
      originalKey: installment.installmentNo
    }));

  const newInstallments = [...installments];
  newInstallments.splice(index, 1, ...newSplits);

  const splitData = {
    original: installment,
    splits: newInstallments.slice(index, index + splitCount)
  };

  return { newInstallments, splitData };
};

export const revertSplit = (originalKey, splitRows, installments) => {
  const splitIndex = installments.findIndex(
    installment => installment.originalKey === originalKey
  );
  if (splitIndex === -1) return { error: 'split not found' };

  const original = splitRows[originalKey].original;
  const newInstallments = [...installments];
  // Replace the two split installments with the original
  newInstallments.splice(splitIndex, 2, original);

  return { newInstallments };
};
