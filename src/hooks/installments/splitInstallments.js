// splitInstallments.js
import { toast } from 'react-toastify';

export const splitInstallment = (selectedInstallments, installments, dueDates) => {
  if (selectedInstallments.length !== 1) {
    toast.error('Please select exactly one installment to split.');
    return { error: 'select one installment only' };
  }

  const index = selectedInstallments[0];
  const installment = installments[index];
  // Use the actual Date object from dueDates rather than the formatted string
  const parentDate = dueDates[index];
  const splitCount = 2;
  const splitAmount = parseFloat(installment.amount) / splitCount;

  // Create two split installments:
  // - The first split (e.g. 1.1) inherits the parent's Date object.
  // - The second split (e.g. 1.2) has no date (null) so the user can select one.
  const firstSplit = {
    ...installment,
    amount: splitAmount.toFixed(2),
    installmentNo: `${installment.installmentNo}.1`,
    isSplit: true,
    originalKey: installment.installmentNo,
    dueDate: parentDate // use parent's Date object
  };

  const secondSplit = {
    ...installment,
    amount: splitAmount.toFixed(2),
    installmentNo: `${installment.installmentNo}.2`,
    isSplit: true,
    originalKey: installment.installmentNo,
    dueDate: null // allow user to pick a date
  };

  // Update installments: remove the original installment and insert the two splits.
  const newInstallments = [...installments];
  newInstallments.splice(index, 1, firstSplit, secondSplit);

  // Update dueDates similarly, using the parent's Date object.
  const newDueDates = [...dueDates];
  newDueDates.splice(index, 1, parentDate, null);

  // Save the original installment (with its actual Date) for reversion later.
  const splitData = {
    original: { ...installment, dueDate: parentDate },
    splits: [firstSplit, secondSplit]
  };

  return { newInstallments, newDueDates, splitData };
};

export const revertSplit = (originalKey, splitRows, installments, dueDates) => {
  const splitIndex = installments.findIndex(
    installment => installment.originalKey === originalKey
  );
  if (splitIndex === -1) return { error: 'split not found' };

  // Retrieve the original installment along with its actual Date.
  const originalInstallment = splitRows[originalKey].original;
  const parentDate = originalInstallment.dueDate;

  const newInstallments = [...installments];
  newInstallments.splice(splitIndex, 2, originalInstallment);

  const newDueDates = [...dueDates];
  newDueDates.splice(splitIndex, 2, parentDate);

  return { newInstallments, newDueDates };
};
